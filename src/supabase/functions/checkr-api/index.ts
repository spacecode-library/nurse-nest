// supabase/functions/checkr-api/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CheckrCandidate {
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone: string;
  zipcode: string;
  dob: string;
  ssn: string;
  driver_license_number?: string;
  driver_license_state?: string;
  previous_driver_license_number?: string;
  previous_driver_license_state?: string;
  copy_requested: boolean;
  custom_id?: string;
  candidate_id?: string;
  adjudication?: string;
  package?: string;
  tags?: string[];
  no_middle_name?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { action, backgroundCheckId, candidateData } = await req.json()

    const checkrApiKey = Deno.env.get('CHECKR_API_KEY')
    const checkrBaseUrl = Deno.env.get('CHECKR_BASE_URL') || 'https://api.checkr-staging.com/v1'

    if (!checkrApiKey) {
      throw new Error('Checkr API key not configured')
    }

    const headers = {
      'Authorization': `Bearer ${checkrApiKey}`,
      'Content-Type': 'application/json',
    }

    let result

    switch (action) {
      case 'createCandidate':
        console.log('🔍 Creating Checkr candidate...')
        
        const candidateResponse = await fetch(`${checkrBaseUrl}/candidates`, {
          method: 'POST',
          headers,
          body: JSON.stringify(candidateData)
        })

        if (!candidateResponse.ok) {
          const errorText = await candidateResponse.text()
          console.error('Checkr API error:', errorText)
          throw new Error(`Checkr API error: ${candidateResponse.status} ${errorText}`)
        }

        const candidate = await candidateResponse.json()
        console.log('✅ Checkr candidate created:', candidate.id)

        // Update background check with candidate ID
        const { error: updateError } = await supabaseClient
          .from('background_checks')
          .update({
            checkr_candidate_id: candidate.id,
            status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('id', backgroundCheckId)

        if (updateError) {
          throw new Error(`Failed to update background check: ${updateError.message}`)
        }

        result = { candidate, backgroundCheckId }
        break

      case 'createReport':
        console.log('🔍 Creating Checkr report...')
        
        const { candidateId, package: packageType } = candidateData
        
        const reportResponse = await fetch(`${checkrBaseUrl}/reports`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            candidate_id: candidateId,
            package: packageType || 'standard_plus'
          })
        })

        if (!reportResponse.ok) {
          const errorText = await reportResponse.text()
          console.error('Checkr report API error:', errorText)
          throw new Error(`Checkr report API error: ${reportResponse.status} ${errorText}`)
        }

        const report = await reportResponse.json()
        console.log('✅ Checkr report created:', report.id)

        // Update background check with report ID
        const { error: reportUpdateError } = await supabaseClient
          .from('background_checks')
          .update({
            checkr_report_id: report.id,
            status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('id', backgroundCheckId)

        if (reportUpdateError) {
          throw new Error(`Failed to update background check with report: ${reportUpdateError.message}`)
        }

        result = { report, backgroundCheckId }
        break

      case 'getReport':
        console.log('🔍 Getting Checkr report status...')
        
        const { reportId } = candidateData
        
        const getReportResponse = await fetch(`${checkrBaseUrl}/reports/${reportId}`, {
          method: 'GET',
          headers
        })

        if (!getReportResponse.ok) {
          const errorText = await getReportResponse.text()
          throw new Error(`Checkr get report API error: ${getReportResponse.status} ${errorText}`)
        }

        const reportStatus = await getReportResponse.json()
        console.log('✅ Checkr report status:', reportStatus.status)

        // Update background check if report is complete
        if (reportStatus.status === 'complete') {
          const { error: statusUpdateError } = await supabaseClient
            .from('background_checks')
            .update({
              status: 'completed',
              result: reportStatus.result,
              completed_at: new Date().toISOString(),
              raw_response: reportStatus,
              updated_at: new Date().toISOString()
            })
            .eq('id', backgroundCheckId)

          if (statusUpdateError) {
            console.error('Error updating background check status:', statusUpdateError)
          }
        }

        result = { report: reportStatus, backgroundCheckId }
        break

      default:
        throw new Error('Invalid action')
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in checkr-api function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
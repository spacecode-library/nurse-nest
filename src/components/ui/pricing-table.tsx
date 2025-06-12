
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon } from "@radix-ui/react-icons"

export type PlanLevel = "basic" | "pro" | string

export interface PricingFeature {
  name: string
  included: PlanLevel | null
}

export interface PricingPlan {
  name: string
  level: PlanLevel
  price: number
  savings?: string
  popular?: boolean
}

export interface PricingTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  features: PricingFeature[]
  plans: PricingPlan[]
  defaultPlan?: PlanLevel
  containerClassName?: string
}

export function PricingTable({
  features,
  plans,
  defaultPlan = "pro",
  className,
  containerClassName,
  ...props
}: PricingTableProps) {
  const [selectedPlan, setSelectedPlan] = React.useState<PlanLevel>(defaultPlan)

  const handlePlanSelect = (plan: PlanLevel) => {
    setSelectedPlan(plan)
  }

  return (
    <section className={cn("py-12", className)}>
      <div className={cn("w-full max-w-5xl mx-auto px-4", containerClassName)} {...props}>
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          {plans.map((plan) => (
            <button
              key={plan.name}
              type="button"
              onClick={() => handlePlanSelect(plan.level)}
              className={cn(
                "flex-1 p-6 rounded-2xl text-left transition-all",
                "border-2 bg-white shadow-md hover:shadow-lg",
                selectedPlan === plan.level
                  ? "border-[#3b82f6] ring-2 ring-[#3b82f6]/20"
                  : "border-[#e2e8f0]",
                plan.popular && "relative"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#3b82f6] to-[#1e40af] text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-medium text-[#1e293b]">{plan.name}</span>
                {plan.savings && (
                  <span className="text-xs bg-[#e6f4ea] text-[#1a7f37] px-2 py-1 rounded-full font-medium">
                    {plan.savings}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-light text-[#1e293b]">${plan.price}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="border border-[#e2e8f0] rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[640px] divide-y divide-[#e2e8f0]">
              <div className="flex items-center p-6 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]">
                <div className="flex-1 text-lg font-medium text-[#1e293b]">Includes</div>
                <div className="flex items-center gap-8 text-sm">
                  {plans.map((plan) => (
                    <div
                      key={plan.level}
                      className="w-24 text-center font-medium text-[#475569]"
                    >
                      {plan.name}
                    </div>
                  ))}
                </div>
              </div>
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className={cn(
                    "flex items-center p-4 transition-colors",
                    feature.included === selectedPlan && "bg-[#eff6ff]"
                  )}
                >
                  <div className="flex-1 text-[#475569]">{feature.name}</div>
                  <div className="flex items-center gap-8">
                    {plans.map((plan) => (
                      <div
                        key={plan.level}
                        className={cn(
                          "w-24 flex justify-center",
                          plan.level === selectedPlan && "font-medium"
                        )}
                      >
                        {shouldShowCheck(feature.included, plan.level) ? (
                          <CheckIcon className="w-5 h-5 text-[#3b82f6]" />
                        ) : (
                          <span className="text-[#cbd5e1]">-</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function shouldShowCheck(
  included: PricingFeature["included"],
  level: string,
): boolean {
  if (included === "all") return true
  if (included === "pro" && (level === "pro" || level === "all")) return true
  if (included === "basic" && (level === "basic" || level === "pro" || level === "all")) return true
  return false
}

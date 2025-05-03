
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';

export default function ClientApplicationSection() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [careType, setCareType] = useState<string>("");
  const [otherCareType, setOtherCareType] = useState<string>("");
  const [payRate, setPayRate] = useState<number[]>([65]);

  return (
    <section className="section-padding bg-gradient-to-br from-white to-nurse-light" id="apply">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to <span className="text-gradient">Find Your Nurse</span>?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Fill out this simple form to start the matching process. We'll connect you with qualified nurses that match your specific needs.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 animate-on-scroll opacity-0">
          <form className="space-y-6">
            {/* Full Name */}
            <div className="grid gap-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Smith"
                required
              />
            </div>
            
            {/* Email */}
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>
            
            {/* Care Type */}
            <div className="grid gap-2">
              <label htmlFor="careType" className="text-sm font-medium">
                What type of care do you need?
              </label>
              <Select onValueChange={(value) => setCareType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select care type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newborn">Newborn Care</SelectItem>
                  <SelectItem value="elderly">Elderly Care</SelectItem>
                  <SelectItem value="private-duty">Private-Duty</SelectItem>
                  <SelectItem value="doctors-office">Doctor's Office</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              {careType === 'other' && (
                <div className="mt-2">
                  <Input
                    placeholder="Please specify"
                    value={otherCareType}
                    onChange={(e) => setOtherCareType(e.target.value)}
                  />
                </div>
              )}
            </div>
            
            {/* Availability */}
            <div className="grid gap-2">
              <label htmlFor="availability" className="text-sm font-medium">
                Schedule Needed
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-Time</SelectItem>
                  <SelectItem value="part-time">Part-Time</SelectItem>
                  <SelectItem value="as-needed">As Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Pay Rate Slider */}
            <div className="grid gap-2">
              <label className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-1" /> Pay Rate (per hour)
              </label>
              <div className="pt-6 pb-2">
                <Slider 
                  value={payRate} 
                  min={45} 
                  max={125} 
                  step={1}
                  onValueChange={setPayRate}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>$45</span>
                <span className="font-medium">${payRate[0]}</span>
                <span>$125</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                A higher pay rate may increase the probability of finding more matches.
              </p>
            </div>
            
            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <Input
                  id="city"
                  type="text"
                  placeholder="New York"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State
                </label>
                <Input
                  id="state"
                  type="text"
                  placeholder="NY"
                  required
                />
              </div>
            </div>
            
            {/* Start Date */}
            <div className="grid gap-2">
              <label htmlFor="startDate" className="text-sm font-medium">
                Expected Nurse Start Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-nurse-dark hover:bg-primary-700 text-white"
            >
              Submit Application
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

// components/dashboard/nurse/LoyaltyProgressCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Star, 
  Gift, 
  Trophy,
  Target,
  CheckCircle
} from 'lucide-react';

interface LoyaltyProgressCardProps {
  completedContracts: number;
  nurseId: string;
}

export default function LoyaltyProgressCard({ 
  completedContracts, 
  nurseId 
}: LoyaltyProgressCardProps) {
  const ELITE_THRESHOLD = 3;
  const isEliteNurse = completedContracts >= ELITE_THRESHOLD;
  const progressPercentage = Math.min((completedContracts / ELITE_THRESHOLD) * 100, 100);
  const contractsNeeded = Math.max(ELITE_THRESHOLD - completedContracts, 0);

  const benefits = [
    {
      id: 'priority_visibility',
      title: 'Priority Visibility',
      description: 'Your profile appears first in client searches',
      icon: Star,
      unlocked: isEliteNurse
    },
    {
      id: 'exclusive_jobs',
      title: 'Exclusive Job Access',
      description: 'Access to high-paying premium positions',
      icon: Trophy,
      unlocked: isEliteNurse
    },
    {
      id: 'loyalty_gifts',
      title: 'Quarterly Rewards',
      description: 'Receive exclusive gifts and bonuses',
      icon: Gift,
      unlocked: isEliteNurse
    },
  ];

  const milestones = [
    { contracts: 1, title: 'First Success', reward: 'Welcome Bonus' },
    { contracts: 2, title: 'Building Trust', reward: 'Profile Boost' },
    { contracts: 3, title: 'Elite Status', reward: 'All Benefits Unlocked' },
    { contracts: 5, title: 'Top Performer', reward: 'Special Recognition' },
    { contracts: 10, title: 'Nurse Champion', reward: 'Exclusive Perks' }
  ];

  return (
    <div className="space-y-6">
      {/* Elite Status Card */}
      <Card className={`${isEliteNurse ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className={`h-5 w-5 mr-2 ${isEliteNurse ? 'text-yellow-600' : 'text-gray-600'}`} />
            Verified Elite Nurse Program
            {isEliteNurse && (
              <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1" />
                Elite Status
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress to Elite Status
                </span>
                <span className="text-sm text-gray-600">
                  {completedContracts} / {ELITE_THRESHOLD} contracts
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3"
              />
              {!isEliteNurse && (
                <p className="text-sm text-gray-600 mt-2">
                  Complete {contractsNeeded} more successful contract{contractsNeeded !== 1 ? 's' : ''} to unlock Elite status
                </p>
              )}
            </div>

            {/* Current Status */}
            <div className="text-center p-4 bg-white rounded-lg border">
              {isEliteNurse ? (
                <div>
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Trophy className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Congratulations! You're an Elite Nurse
                  </h3>
                  <p className="text-sm text-gray-600">
                    You've earned elite status and unlocked all premium benefits
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Target className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Working Toward Elite Status
                  </h3>
                  <p className="text-sm text-gray-600">
                    Keep completing successful contracts to unlock premium benefits
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="h-5 w-5 mr-2" />
            Elite Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                    benefit.unlocked 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 p-2 rounded-lg ${
                    benefit.unlocked 
                      ? 'bg-green-100' 
                      : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      benefit.unlocked 
                        ? 'text-green-600' 
                        : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${
                        benefit.unlocked 
                          ? 'text-gray-900' 
                          : 'text-gray-500'
                      }`}>
                        {benefit.title}
                      </h4>
                      {benefit.unlocked && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className={`text-sm ${
                      benefit.unlocked 
                        ? 'text-gray-700' 
                        : 'text-gray-500'
                    }`}>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Milestones Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Achievement Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              const isCompleted = completedContracts >= milestone.contracts;
              const isCurrent = completedContracts < milestone.contracts && 
                               (index === 0 || completedContracts >= milestones[index - 1].contracts);
              
              return (
                <div
                  key={milestone.contracts}
                  className={`flex items-center space-x-4 p-3 rounded-lg border ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : isCurrent 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{milestone.contracts}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${
                          isCompleted 
                            ? 'text-green-900' 
                            : isCurrent 
                              ? 'text-blue-900' 
                              : 'text-gray-600'
                        }`}>
                          {milestone.title}
                        </h4>
                        <p className={`text-sm ${
                          isCompleted 
                            ? 'text-green-700' 
                            : isCurrent 
                              ? 'text-blue-700' 
                              : 'text-gray-500'
                        }`}>
                          {milestone.reward}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          isCompleted 
                            ? 'text-green-700' 
                            : isCurrent 
                              ? 'text-blue-700' 
                              : 'text-gray-500'
                        }`}>
                          {milestone.contracts} contract{milestone.contracts !== 1 ? 's' : ''}
                        </p>
                        {isCompleted && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      {!isEliteNurse && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Ready to Unlock Elite Status?
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  Complete {contractsNeeded} more successful contract{contractsNeeded !== 1 ? 's' : ''} to:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Get priority placement in job searches</li>
                  <li>• Access exclusive high-paying positions</li>
                  <li>• Receive quarterly loyalty rewards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
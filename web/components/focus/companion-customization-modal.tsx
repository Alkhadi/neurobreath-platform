'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  X, Lock, Check, Sparkles, Crown, Settings
} from 'lucide-react'
import {
  COMPANION_TYPES,
  COMPANION_ACCESSORIES,
  type CompanionProfile
} from '@/lib/focus/companion-data'
import type { CompanionData, CompanionType } from '@/lib/focus-garden-store'

interface CompanionCustomizationModalProps {
  companion: CompanionData;
  userProgress: {
    gardenLevel: number;
    totalHarvests: number;
    currentStreak: number;
    earnedBadges: string[];
    completedQuests: number;
  };
  onClose: () => void;
  onChangeType: (type: CompanionType) => void;
  onChangeName: (name: string) => void;
  onEquipAccessory: (accessoryId: string) => void;
  onUnequipAccessory: () => void;
}

export function CompanionCustomizationModal({
  companion,
  userProgress,
  onClose,
  onChangeType,
  onChangeName,
  onEquipAccessory,
  onUnequipAccessory
}: CompanionCustomizationModalProps) {
  const [activeTab, setActiveTab] = useState<'type' | 'name' | 'accessories'>('type');
  const [nameInput, setNameInput] = useState(companion.name);

  // Check if companion type is unlocked
  const isCompanionUnlocked = (profile: CompanionProfile): boolean => {
    if (!profile.unlockRequirement) return true;

    const { type, value } = profile.unlockRequirement;
    
    switch (type) {
      case 'level':
        return userProgress.gardenLevel >= value;
      case 'harvests':
        return userProgress.totalHarvests >= value;
      case 'streak':
        return userProgress.currentStreak >= value;
      case 'quests':
        return userProgress.completedQuests >= value;
      default:
        return false;
    }
  };

  // Check if accessory is unlocked
  const isAccessoryUnlocked = (accessoryId: string): boolean => {
    const accessory = COMPANION_ACCESSORIES.find(a => a.id === accessoryId);
    if (!accessory) return false;

    const { type, value } = accessory.unlockRequirement;
    
    switch (type) {
      case 'level':
        return userProgress.gardenLevel >= (value as number);
      case 'harvests':
        return userProgress.totalHarvests >= (value as number);
      case 'streak':
        return userProgress.currentStreak >= (value as number);
      case 'badge':
        return userProgress.earnedBadges.includes(value as string);
      case 'quest':
        return userProgress.completedQuests >= (value as number);
      default:
        return false;
    }
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onChangeName(nameInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-6 text-white relative">
          <button
            onClick={onClose}
            aria-label="Close companion customization"
            title="Close"
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-5xl backdrop-blur-sm">
              {COMPANION_TYPES[companion.type].emoji}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">Customize Your Companion</h2>
              <p className="text-purple-100">Make your companion uniquely yours!</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6">
          {[
            { id: 'type', label: 'Companion Type', icon: Sparkles },
            { id: 'name', label: 'Name', icon: Settings },
            { id: 'accessories', label: 'Accessories', icon: Crown }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 font-semibold transition-colors relative",
                activeTab === tab.id
                  ? "text-purple-600"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {/* Companion Type Tab */}
          {activeTab === 'type' && (
            <div>
              <p className="text-slate-600 mb-6">
                Choose your companion! Some companions unlock as you progress.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {Object.values(COMPANION_TYPES).map(profile => {
                  const isUnlocked = isCompanionUnlocked(profile);
                  const isActive = companion.type === profile.id;
                  
                  return (
                    <button
                      key={profile.id}
                      onClick={() => isUnlocked && onChangeType(profile.id)}
                      disabled={!isUnlocked}
                      className={cn(
                        "p-5 rounded-2xl border-2 transition-all text-left",
                        isActive
                          ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-400 ring-2 ring-purple-300 ring-offset-2"
                          : isUnlocked
                          ? "bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg"
                          : "bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={cn(
                          "text-5xl",
                          !isUnlocked && "grayscale opacity-50"
                        )}>
                          {profile.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-slate-900">{profile.name}</h3>
                            {isActive && (
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {!isUnlocked && (
                              <Lock className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{profile.description}</p>
                          <p className="text-xs text-slate-500 italic">{profile.personality}</p>
                        </div>
                      </div>
                      
                      {profile.unlockRequirement && !isUnlocked && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
                          <Lock className="w-3 h-3 inline mr-1" />
                          Unlock: {profile.unlockRequirement.type} {profile.unlockRequirement.value}+
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Name Tab */}
          {activeTab === 'name' && (
            <div>
              <p className="text-slate-600 mb-6">
                Give your companion a special name! This makes your bond even stronger.
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-purple-200 mb-6">
                  <div className="text-center mb-4">
                    <div className="text-7xl mb-3">
                      {COMPANION_TYPES[companion.type].emoji}
                    </div>
                    <p className="text-sm text-slate-600">Current name:</p>
                    <p className="text-2xl font-bold text-slate-900">{companion.name}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      New Name
                    </label>
                    <Input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Enter a name..."
                      maxLength={20}
                      className="text-lg h-12"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {nameInput.length}/20 characters
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleSaveName}
                    disabled={!nameInput.trim() || nameInput.trim() === companion.name}
                    className="w-full h-12 text-lg bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Save Name
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Accessories Tab */}
          {activeTab === 'accessories' && (
            <div>
              <p className="text-slate-600 mb-6">
                Unlock and equip accessories as you progress! Each one makes your companion more special.
              </p>
              
              {/* Currently Equipped */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border-2 border-amber-200 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">Currently Equipped</h3>
                    {companion.activeAccessory ? (
                      <p className="text-slate-600">
                        {COMPANION_ACCESSORIES.find(a => a.id === companion.activeAccessory)?.name || 'None'}
                      </p>
                    ) : (
                      <p className="text-slate-500 italic">No accessory equipped</p>
                    )}
                  </div>
                  <div className="relative">
                    <div className="text-6xl">
                      {COMPANION_TYPES[companion.type].emoji}
                    </div>
                    {companion.activeAccessory && (
                      <div className="absolute -top-2 -right-2 text-3xl">
                        {COMPANION_ACCESSORIES.find(a => a.id === companion.activeAccessory)?.emoji}
                      </div>
                    )}
                  </div>
                </div>
                {companion.activeAccessory && (
                  <Button
                    onClick={onUnequipAccessory}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    Remove Accessory
                  </Button>
                )}
              </div>
              
              {/* Available Accessories */}
              <h3 className="font-bold text-lg text-slate-900 mb-4">Available Accessories</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {COMPANION_ACCESSORIES.map(accessory => {
                  const isUnlocked = isAccessoryUnlocked(accessory.id);
                  const isEquipped = companion.activeAccessory === accessory.id;
                  
                  return (
                    <button
                      key={accessory.id}
                      onClick={() => isUnlocked && onEquipAccessory(accessory.id)}
                      disabled={!isUnlocked || isEquipped}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-left",
                        isEquipped
                          ? "bg-green-50 border-green-400"
                          : isUnlocked
                          ? "bg-white border-slate-200 hover:border-amber-300 hover:shadow-md"
                          : "bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "text-4xl",
                          !isUnlocked && "grayscale opacity-50"
                        )}>
                          {accessory.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900">{accessory.name}</h4>
                            {isEquipped && (
                              <Check className="w-4 h-4 text-green-600" />
                            )}
                            {!isUnlocked && (
                              <Lock className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mb-2">{accessory.description}</p>
                          {!isUnlocked && (
                            <p className="text-xs text-amber-600 font-medium">
                              Unlock: {accessory.unlockRequirement.type} {accessory.unlockRequirement.value}+
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              <p className="font-semibold">Companion Level: {companion.level}</p>
              <p className="text-xs">Keep interacting to level up!</p>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

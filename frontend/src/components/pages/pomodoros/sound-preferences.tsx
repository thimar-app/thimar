"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import sounds from "@/db/sounds";
import { quranList, reciterList } from "@/db/quran";

// Update the TimerSettings interface to include the new playNextSurah setting
interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  soundEnabled: boolean;
  volume: number;
  activeSounds: string[];
  playDuringBreaks: boolean;
  quranReciter: string | null;
  quranSurah: string | null;
  quranVolume: number;
  playNextSurah: boolean; // Add this new setting
}

interface SoundPreferencesProps {
  settings: TimerSettings;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  shouldPlaySounds: boolean;
  shouldPlayQuran: boolean;
  timerState: "pomodoro" | "shortBreak" | "longBreak";
  timerStatus: "idle" | "running" | "paused" | "completed";
}

// Update the SoundPreferences component to include the new playNextSurah toggle
export function SoundPreferences({
  settings,
  updateSettings,
  shouldPlaySounds,
  shouldPlayQuran,
  timerState,
  timerStatus,
}: SoundPreferencesProps) {
  const [volume, setVolume] = useState(settings.volume);
  const [quranVolume, setQuranVolume] = useState(settings.quranVolume);
  const [reciterSearch, setReciterSearch] = useState("");
  const [surahSearch, setSurahSearch] = useState("");

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    updateSettings({ volume: newVolume });
  };

  const handleQuranVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setQuranVolume(newVolume);
    updateSettings({ quranVolume: newVolume });
  };

  const toggleSound = (soundName: string) => {
    let newActiveSounds: string[];

    if (settings.activeSounds.includes(soundName)) {
      // Remove sound if already active
      newActiveSounds = settings.activeSounds.filter(
        (name) => name !== soundName
      );
    } else {
      // Add sound if not active
      newActiveSounds = [...settings.activeSounds, soundName];
    }

    updateSettings({
      activeSounds: newActiveSounds,
      soundEnabled:
        newActiveSounds.length > 0 ||
        (settings.quranReciter && settings.quranSurah) ||
        settings.soundEnabled,
    });
  };

  const handleReciterChange = (value: string) => {
    updateSettings({
      quranReciter: value,
      soundEnabled: true,
    });
  };

  const handleSurahChange = (value: string) => {
    updateSettings({
      quranSurah: value,
      soundEnabled: true,
    });
  };

  const togglePlayDuringBreaks = () => {
    updateSettings({ playDuringBreaks: !settings.playDuringBreaks });
  };

  // Add a toggle for enabling/disabling all sounds
  const toggleSoundEnabled = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  // Add a toggle for playing next surah
  const togglePlayNextSurah = () => {
    updateSettings({ playNextSurah: !settings.playNextSurah });
  };

  // Filter reciters based on search input
  const filteredReciters = reciterList.filter(
    (reciter) =>
      reciter.name_en.toLowerCase().includes(reciterSearch.toLowerCase()) ||
      reciter.name_ar.includes(reciterSearch)
  );

  // Filter surahs based on search input
  const filteredSurahs = quranList.filter(
    (surah) =>
      surah.name_en.toLowerCase().includes(surahSearch.toLowerCase()) ||
      surah.name_ar.includes(surahSearch)
  );

  return (
    <div className="flex flex-col gap-4 max-h-[calc(100vh-100px)] pt-4">
      {/* Quran Audio Section */}
      <div className="space-y-4 border-b border-[#333333] pb-6">
        <div className="flex items-center gap-4">
          <Volume2 size={20} className="text-gray-400" />
          <Slider
            value={[quranVolume]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleQuranVolumeChange}
            className="flex-1 [&>span:first-child]:bg-[#333333] [&>span:first-child]:h-2 [&>span:first-child_span]:bg-[#7c3aed] [&_[role=slider]]:bg-white [&_[role=slider]]:border-none [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
        </div>

        <div className="space-y-2 w-full">
          <Select
            value={settings.quranReciter || ""}
            onValueChange={handleReciterChange}
          >
            <SelectTrigger className="!bg-card w-full">
              <SelectValue placeholder="Select Reciter" />
            </SelectTrigger>
            <SelectContent className="bg-[#1e1e1e] border-[#333333] text-white">
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Search reciter..."
                  value={reciterSearch}
                  onChange={(e) => setReciterSearch(e.target.value)}
                  className="w-full bg-[#333333] text-white border-none rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {filteredReciters.map((reciter) => (
                <SelectItem
                  key={reciter.query}
                  value={reciter.query}
                  className="focus:bg-[#333333] focus:text-white"
                >
                  {reciter.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Select
            value={settings.quranSurah || ""}
            onValueChange={handleSurahChange}
            disabled={!settings.quranReciter}
          >
            <SelectTrigger className="!bg-card w-full">
              <SelectValue placeholder="Select Surah" />
            </SelectTrigger>
            <SelectContent className="bg-[#1e1e1e] border-[#333333] text-white max-h-[300px]">
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Search surah..."
                  value={surahSearch}
                  onChange={(e) => setSurahSearch(e.target.value)}
                  className="w-full bg-[#333333] text-white border-none rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {filteredSurahs.map((surah) => (
                <SelectItem
                  key={surah.query}
                  value={surah.query}
                  className="focus:bg-[#333333] focus:text-white"
                >
                  {surah.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-200">Play next surah automatically</span>
          <Switch
            checked={settings.playNextSurah}
            onCheckedChange={togglePlayNextSurah}
            className="data-[state=checked]:bg-[#7c3aed]"
          />
        </div>
      </div>

      {/* Natural Sounds Section */}
      <div className="space-y-4 border-b border-[#333333] pb-6">
        <div className="flex items-center gap-4">
          <Volume2 size={20} className="text-gray-400" />
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1 [&>span:first-child]:bg-[#333333] [&>span:first-child]:h-2 [&>span:first-child_span]:bg-[#7c3aed] [&_[role=slider]]:bg-white [&_[role=slider]]:border-none [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
        </div>

        <div>
          <h3 className="text-lg mb-4">Select Natural Sound</h3>
          <div className="grid grid-cols-4 gap-2">
            {sounds.map((sound) => {
              const isActive = settings.activeSounds.includes(sound.name);
              return (
                <Button
                  key={sound.name}
                  variant="ghost"
                  className={cn(
                    "bg-card w-full aspect-square p-0 flex flex-col items-center justify-center",
                    isActive && "bg-[#7c3aed] hover:!bg-[#6d28d9]"
                  )}
                  onClick={() => toggleSound(sound.name)}
                >
                  <sound.Icon size={24} />
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="flex items-center justify-between">
        <span className="text-gray-200">Play sounds during breaks</span>
        <Switch
          checked={settings.playDuringBreaks}
          onCheckedChange={togglePlayDuringBreaks}
          className="data-[state=checked]:bg-[#7c3aed]"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-200">Enable sounds during sessions</span>
        <Switch
          checked={settings.soundEnabled}
          onCheckedChange={toggleSoundEnabled}
          className="data-[state=checked]:bg-[#7c3aed]"
        />
      </div>
    </div>
  );
}

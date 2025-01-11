import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface InfosidebarProps {
  modelData: {
    Domain: string[];
    Task: string[];
    Confidence: string;
    'Base model': string;
    Citations: string;
    Link: string;
    'Model accessibility': string;
    'Country (from Organization)': string[];
  };
}

export default function Infosidebar({ modelData }: InfosidebarProps) {
  return (
    <div className="flex border-l pl-4 min-h-full">
      <div className="flex-1">
        <h2 className="text-tremor-large font-inter text-gray-700 font-medium mb-2">Model Details</h2>

        {/* Domain Section */}
        {modelData.Domain.length > 0 && (
          <div className="mt-1">
            <span className="text-xs font-medium text-gray-500">Domain:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {modelData.Domain.map((domain) => {
                const sanitizedDomain = domain.trim().toLowerCase().replace(/\s+/g, "_");
                return (
                  <Badge
                    key={sanitizedDomain}
                    variant="outline"
                    className="hover:border-blue-500 cursor-pointer px-2"
                  >
                    <img
                      src={`/DomainIcons/${sanitizedDomain}.png`}
                      alt={domain.trim()}
                      className="w-4 h-4 mr-1"
                    />
                    <a href="#">{domain.trim()}</a>
                  </Badge>
                );
              })}
            </div>
            <Separator className="mt-3" />
          </div>
        )}

        {/* Task Section */}
        {modelData.Task.length > 0 && (
          <div className="mt-3">
            <span className="text-xs font-medium text-gray-500">Task:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {modelData.Task.map((task) => {
                const sanitizedTask = task.trim().toLowerCase().replace(/[\s-/()]/g, "_");
                return (
                  <Badge
                    key={sanitizedTask}
                    variant="secondary"
                    className="hover:border-blue-500 cursor-pointer px-2"
                  >
                    <img
                      src={`/TaskIcons/${sanitizedTask}.svg`}
                      alt={task.trim()}
                      className="w-4 h-4 mr-1"
                    />
                    <a href="#">{task.trim()}</a>
                  </Badge>
                );
              })}
            </div>
            <Separator className="mt-3" />
          </div>
        )}

        {/* Country Section */}
        {modelData['Country (from Organization)'] && (
          <div className="mt-3">
            <span className="text-xs font-medium text-gray-500">Country:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {modelData['Country (from Organization)'].map((country, index) => {
                const sanitizedCountry = country.trim().toLowerCase().replace(/\s+/g, "_");
                return (
                  <TooltipProvider key={`${sanitizedCountry}-${index}`}>
                    <Tooltip>
                      <TooltipTrigger>
                        <img
                          src={`/CountryIcons/${sanitizedCountry}.png`}
                          alt={country.trim()}
                          className="inline-block w-7 h-7 ml-1"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{country.trim()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
            <Separator className="mt-3" />
          </div>
        )}

         {/* Model Accessibility Section */}
         {modelData['Model accessibility'] && (
          <div className="mt-3">
            <span className="text-xs font-medium text-gray-500">Model Access:</span>
            <div className="mt-1">
              <Badge variant="outline" className="px-2">{modelData['Model accessibility']}</Badge>
            </div>
            <hr className="mt-3 border-gray-300" />
          </div>
        )}

        {/* Base Model Section */}
        {modelData['Base model'] && (
          <div className="mt-3">
            <span className="text-xs font-medium text-gray-500">Base Model:</span>
            <div className="text-tremor-small mt-1">
              <span>{modelData['Base model']}</span>
            </div>
            <Separator className="mt-3" />
          </div>
        )}

        {/* Citations Section */}
        {modelData.Citations && (
          <div className="mt-3">
            <span className="text-xs font-medium text-gray-500">Citations:</span>
            <div className="text-tremor-small mt-1">
              <span>{modelData.Citations}</span>
            </div>
            <Separator className="mt-3" />
          </div>
        )}

       {/* Official Docs Button */}
{modelData.Link && (
  <div className="mt-4">
    <a
      href={modelData.Link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Button
        variant="outline" // Outline variant
        className="bg-gray-800 text-white w-full" // Custom classes
      >
        Official Docs &lt;/&gt;
      </Button>
    </a>
  </div>
)}

        {/* Buttons */}
        <div className="flex space-x-2 mt-4 mb-4 justify-center md:hidden">
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-black flex items-center justify-center gap-1 px-4 py-2"
          >
            <img src="/tableicons/compare.svg" alt="compare" className="w-5 h-5" />
            Compare
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-black flex items-center justify-center gap-1 px-4 py-2"
          >
            <img src="/tableicons/monitor.svg" alt="use model" className="w-5 h-5" />
            Use Model
          </Button>
        
        </div>
      </div>
    </div>
  );
}

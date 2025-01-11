import React from 'react';
import { Button } from 'components/ui/button'; // Update the path based on your project structure
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ModelPageContentProps {
  modelData: {
    Model: string;
    Organization: string[];
    'Publication date': string;
    'Country (from Organization)': string[];
    Abstract: string;
    Link: string;
    'Model accessibility': string;
    Reference: string;
  };
}

export default function ModelPageContent({ modelData }: ModelPageContentProps) {
  return (
    <div className="p-4">
      {/* Breadcrumb with Avatar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"> {/* Reduced gap */}
          {/* Avatar */}
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={`/OrganizationIcons/${modelData.Organization[0]
                ?.toLowerCase()
                .replace(/\s+/g, '_')}.png`}
              alt={modelData.Organization[0]}
            />
            <AvatarFallback>{modelData.Model?.[0] || '?'}</AvatarFallback>
          </Avatar>

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-gray-500">
              <li>
                <a href="#" className="hover:underline text-tremor-default  hidden sm:inline">
                  {modelData.Organization[0]}
                </a>
              </li>
              <li className="mx-1">&gt;</li> {/* Changed separator */}
              <li className=" font-semibold font-inter text-tremor-large text-gray-700">
                {modelData.Model}
              </li>
            </ol>
          </nav>

          {/* Verify Icon and CREATED ON */}
          <div className="flex items-center gap-4 "> {/* Reduced gap */}
            <img src="/verify.png" alt="Verify" className="w-5 h-5" />
            <span className="text-gray-500 text-tremor-label hidden sm:inline">
              CREATED ON {modelData['Publication date']}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
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

      {/* Separator */}
      <div className="border-b shadow-sm mb-1"></div>

    </div>
  );
}

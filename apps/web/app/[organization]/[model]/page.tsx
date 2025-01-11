import React from 'react';
import { BasicLayout } from 'components/layouts/BasicLayout';
import ModelPageContent from './modelpageheader';
import ModelInfo from './modelinfo';
import Infosidebar from './infosidebar';

interface ModelPageProps {
  params: { organization: string; model: string };
}

async function fetchModelData(organization: string, model: string) {
  const apiUrl = `http://localhost:5000/api/models/${organization.replace(/_/g, ' ')}/${model}`;
  console.log('Fetching data from URL:', apiUrl); // Log the URL
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.json();
}


export default async function ModelPage({ params }: ModelPageProps) {
  // Ensure params are awaited
  const { organization, model } = await Promise.resolve(params);

  try {
    const modelData = await fetchModelData(organization, model);

    return (
      <BasicLayout>
        <ModelPageContent modelData={modelData} />
        <div className="flex flex-col md:flex-row-reverse md:divide-x-0 divide-y md:divide-y-0 divide-gray-200">
          {/* Infosidebar */}
          <div className="md:w-2/5 w-full">
            <Infosidebar modelData={modelData} />
          </div>
          {/* ModelInfo */}
          <div className="md:w-3/5 w-full">
            <ModelInfo modelData={modelData} />
          </div>
        </div>
      </BasicLayout>
    );
  } catch (error) {
    console.error('❌ Error fetching model:', error);
    return (
      <BasicLayout>
        <p className="text-red-500">❌ Error fetching model data</p>
      </BasicLayout>
    );
  }
}

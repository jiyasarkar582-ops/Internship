import { getAppConfig } from "@/lib/config-parser";
import { notFound } from "next/navigation";
import DynamicEntityView from "@/components/DynamicEntityView";

export default async function EntityPage({ params }: { params: Promise<{ entity: string }> }) {
  const resolvedParams = await params;
  const config = getAppConfig();
  const entityConfig = config.entities.find(e => e.slug === resolvedParams.entity);
  
  if (!entityConfig) {
    notFound();
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{entityConfig.name}</h1>
      </div>
      <DynamicEntityView entity={entityConfig} />
    </div>
  )
}

import { CampaignSimulator } from "@/components/campaign-simulator";
import { DataBreadcrumb } from "@/components/data-breadcrumb";

export default function SimulatePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <DataBreadcrumb current="Simulator" />
      <div>
        <h1 className="text-2xl font-bold">Campaign Simulator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Estimate reach, engagement, and conversion projections for a set of
          influencer channels with a given budget.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <CampaignSimulator />
      </div>

      <div className="rounded-lg border bg-muted/50 p-4 text-sm">
        <h3 className="font-medium">How it works</h3>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          <li>
            <strong>Reach</strong> = median recent views per channel
          </li>
          <li>
            <strong>Engagements</strong> = reach × median engagement rate
          </li>
          <li>
            <strong>Conversions</strong> = engagements × conversion rate
            (1%/2%/3%)
          </li>
          <li>
            <strong>Cost/Conversion</strong> = budget ÷ estimated conversions
          </li>
        </ul>
      </div>
    </div>
  );
}

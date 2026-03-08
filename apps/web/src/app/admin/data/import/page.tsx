import { CsvUploader } from "@/components/csv-uploader";
import { DataBreadcrumb } from "@/components/data-breadcrumb";

export default function ImportPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <DataBreadcrumb current="Import" />
      <div>
        <h1 className="text-2xl font-bold">Import Channels</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a CSV file or paste channel IDs to batch import and analyze
          YouTube channels.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <CsvUploader />
      </div>

      <div className="rounded-lg border bg-muted/50 p-4 text-sm">
        <h3 className="font-medium">CSV Format</h3>
        <p className="mt-1 text-muted-foreground">
          Include a header row with one of: <code>channel_id</code>,{" "}
          <code>handle</code>, or <code>id</code>
        </p>
        <pre className="mt-2 rounded bg-background p-2 text-xs">
          {`channel_id\nUCzwPKK7dTlO2W21g122MNkQ\nUC_x5XG1OV2P6uZZ5FSM9Ttw`}
        </pre>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4 text-sm">
        <h3 className="font-medium">Quota Budget</h3>
        <p className="mt-1 text-muted-foreground">
          Each channel uses ~13 API units. Free tier: 10,000 units/day = ~750
          channels/day. Max 100 channels per import.
        </p>
      </div>
    </div>
  );
}

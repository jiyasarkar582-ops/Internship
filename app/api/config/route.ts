import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "app_config.json");

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!fs.existsSync(CONFIG_PATH)) {
      return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newConfig = await req.json();

    // Basic validation
    if (!newConfig.appName || !Array.isArray(newConfig.entities)) {
      return NextResponse.json({ error: "Invalid config: appName and entities are required" }, { status: 400 });
    }

    // Ensure each entity has required shape
    for (const entity of newConfig.entities) {
      if (!entity.name || !entity.slug || !Array.isArray(entity.fields)) {
        return NextResponse.json(
          { error: `Entity "${entity.name || "unnamed"}" is missing required fields (name, slug, fields[])` },
          { status: 400 }
        );
      }
    }

    // Write to file atomically
    const tmpPath = CONFIG_PATH + ".tmp";
    fs.writeFileSync(tmpPath, JSON.stringify(newConfig, null, 2), "utf8");
    fs.renameSync(tmpPath, CONFIG_PATH);

    // The DB schema is lazily synced on next API call to /api/dynamic/[entity]
    // No need to force-sync here; the schema-generator runs on each request.
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

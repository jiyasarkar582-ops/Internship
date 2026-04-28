import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAppConfig } from '@/lib/config-parser';
import crypto from 'crypto';

export async function GET(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const entitySlug = params?.entity;
    
    if (!entitySlug) {
      return NextResponse.json({ error: 'Entity slug is required' }, { status: 400 });
    }

    const config = getAppConfig();
    const entityConfig = config.entities.find(e => e.slug === entitySlug);
    
    if (!entityConfig) {
      return NextResponse.json({ error: 'Entity not found in configuration' }, { status: 404 });
    }

    const db = await getDb();
    const records = await db.all(
      `SELECT * FROM "${entitySlug}" ORDER BY created_at DESC`
    );

    return NextResponse.json(records);
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const entitySlug = params?.entity;
    const body = await request.json();

    const config = getAppConfig();
    const entityConfig = config.entities.find(e => e.slug === entitySlug);
    
    if (!entityConfig) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }

    // Basic validation based on config
    const validData: any = {};
    for (const field of entityConfig.fields) {
      if (field.required && (body[field.name] === undefined || body[field.name] === '')) {
        return NextResponse.json({ error: `Field ${field.name} is required` }, { status: 400 });
      }
      if (body[field.name] !== undefined) {
          validData[field.name] = body[field.name];
      }
    }

    const db = await getDb();
    const newId = crypto.randomUUID();
    validData.id = newId;

    const keys = Object.keys(validData);
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map(k => validData[k]);

    await db.run(
      `INSERT INTO "${entitySlug}" ("${keys.join('", "')}") VALUES (${placeholders})`,
      values
    );

    return NextResponse.json(validData, { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const entitySlug = params?.entity;
    const body = await request.json();
    const { id, created_at, updated_at, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required for update' }, { status: 400 });
    }

    const config = getAppConfig();
    const entityConfig = config.entities.find(e => e.slug === entitySlug);
    if (!entityConfig) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }

    const validData: any = {};
    for (const field of entityConfig.fields) {
      if (data[field.name] !== undefined) {
          validData[field.name] = data[field.name];
      }
    }

    const keys = Object.keys(validData);
    if (keys.length === 0) {
        return NextResponse.json({ id, ...data });
    }

    const setClause = keys.map(k => `"${k}" = ?`).join(', ');
    const values = keys.map(k => validData[k]);
    values.push(id); // for WHERE id = ?

    const db = await getDb();
    const result = await db.run(
      `UPDATE "${entitySlug}" SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ id, ...validData });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const entitySlug = params?.entity;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.run(
      `DELETE FROM "${entitySlug}" WHERE id = ?`,
      [id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

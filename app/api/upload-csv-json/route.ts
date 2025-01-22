import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Same interface, though you could keep or remove it here
interface CsvRow {
    postId: string;
    id: string;
    name: string;
    email: string;
    body: string;
}

export async function POST(request: Request) {
    try {
        // 1. Read the JSON body
        const { rows } = (await request.json()) as { rows: CsvRow[] };

        // 2. Map them directly to your schema fields (all strings)
        const dataToInsert = rows.map((row) => ({
            id: row.id,
            postId: row.postId,
            name: row.name,
            email: row.email,
            body: row.body,
        }));

        // 3. Insert them into the "CsvData" table
        await prisma.csvData.createMany({
            data: dataToInsert,
            skipDuplicates: true,
        });

        return NextResponse.json({ message: "CSV uploaded successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in JSON route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

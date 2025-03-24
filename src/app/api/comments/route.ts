import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from "path";

const filePath = path.resolve('./data/comments.json')

export async function GET(req:NextRequest) {
    const data = JSON.parse(fs.readFileSync(filePath , 'utf-8'))
    return NextResponse.json(data)
}
import {  NextResponse } from 'next/server';
import fs from 'fs';
import path from "path";

const filePath = path.resolve('./data/user.json')

export async function GET(req:Request) {
    const authHeader = req.headers.get("Authorization");

    if(authHeader !== 'Bearer X9aP4qT7Lm2R'){
        return NextResponse.json(
            { error: "Unauthorized" }, 
            { status: 401 }
        );
    }
    const data = JSON.parse(fs.readFileSync(filePath , 'utf-8'))
    return NextResponse.json(data)
}
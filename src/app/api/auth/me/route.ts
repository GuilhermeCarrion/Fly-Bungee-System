import {prisma} from "@/lib/prisma";
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try{
        // Extrair token do header
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")){
            return NextResponse.json(
                { user:null },
                { status: 200 }
            )
        }

        const token = authHeader.substring(7);

        // Validando token
        let decoded;
        try{
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch(err){
            // Token invalido ou expirado
            return NextResponse.json(
                {user:null}, {status:200}
            )
        }

        const session = await prisma.session.findUnique({
            where: {token},
            include: {user:true}
        })

        if(!session || session.expiresAt <= new Date(Date.now())){
            return  NextResponse.json({user:null}, {status:200})
        }

        return NextResponse.json({
            user:{
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role,
                academyId: session.user.academyId
            }

        })


    }catch(error){
        console.error("Erro em /me",error);
        return NextResponse.json(
            {error: "Erro no servidor"},
            { status: 500}
        )
    }
}
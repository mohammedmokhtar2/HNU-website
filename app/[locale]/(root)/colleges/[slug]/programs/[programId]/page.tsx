'use client';
import { useParams } from 'next/navigation';
import React from 'react'

function ProgramPage() {
    const params = useParams();
    const { programId } = params as { programId: string };
    return (
        <div>{programId}</div>
    )
}

export default ProgramPage
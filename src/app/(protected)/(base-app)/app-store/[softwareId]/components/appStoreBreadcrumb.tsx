"use client"
import { RenderAppBreadcrumb } from '@/ikon/components/app-breadcrumb/index';
import { useSearchParams } from 'next/navigation';
import React, { use } from 'react'

function AppStoreBreadcrumb({ softwareId }: { softwareId: string }) {
    const searchParams = useSearchParams();
    const softwareName = searchParams.get("name")?.replace(/-/g, " ");
    return (
        <RenderAppBreadcrumb breadcrumb={{ level: 2, title: softwareName || softwareId, href: "/app-store/" + softwareId + "?name=" + softwareName }} />
    )
}

export default AppStoreBreadcrumb
import { ReactNode } from "react";

export interface HarvesterData {
    [key: string]: any;
}

export interface ApiResponse {
    data: HarvesterData;
    error?: string;
}

export interface WidgetDataItem {
    name: string;
    amount: number;
    borderColor: string;
}

export interface VoteMsg {
    cssVariant: string;
    iconHTML: ReactNode;
    fraction: string;
    flagText: string;
}

export interface LastHttpsCertificate {
    validFrom: string;
    validTill: string;
    size: number;
    version: string;
    publicKeyAlgorithm: string;
    issuer: Array<string>;
}

export interface DataItem {
    title: string;
    description: string;
}

export interface AnalysisResult {
    method: string;
    engine_name: string;
    category: string;
    result: string;
}

export interface PopularityRanks {
    rank: number;
    timestamp: number;
}

export interface LastDnsRecords {
    type: string;
    ttl: number;
    value: string;
    rname?: string;
    serial?: number;
    refresh?: number;
    retry?: number;
    expire?: number;
    minimum?: number;
}

export interface WhoisData {
    admin: Record<string, string>;
    registrar: Record<string, string>;
    domain: Record<string, string>;
    nameServers: string[];
}

export interface WidgetData {
    data: {
        id: string;
        type: string;
        links: {
            self: string;
        };
        attributes: {
            last_https_certificate_date: number;
            categories: Record<string, unknown>;
            last_analysis_results: Record<string, AnalysisResult>;
            total_votes: {
                harmless: number;
                malicious: number;
            };
            last_dns_records_date: number;
            popularity_ranks: Record<string, PopularityRanks>;
            last_modification_date: number;
            last_update_date: number;
            registrar: string;
            creation_date: number;
            last_analysis_stats: {
                malicious: number;
                suspicious: number;
                undetected: number;
                harmless: number;
                timeout: number;
            };
            last_analysis_date: number;
            tags: string[];
            tld: string;
            jarm: string;
            last_https_certificate: {
                cert_signature: {
                    signature_algorithm: string;
                    signature: string;
                };
                extensions: Record<string, unknown>;
                validity: {
                    not_after: string;
                    not_before: string;
                };
                size: number;
                version: string;
                public_key: {
                    algorithm: string;
                    ec?: {
                        oid: string;
                        pub: string;
                    };
                };
                thumbprint_sha256: string;
                thumbprint: string;
                serial_number: string;
                issuer: {
                    C: string;
                    O: string;
                    CN: string;
                };
                subject: {
                    CN: string;
                };
            };
            whois: string;
            reputation: number;
            last_dns_records: LastDnsRecords[];
        };
    };
}

export interface VendorDataTable {
    vendorName: string;
    flag: string;
}

export interface PopularityRanksData {
    rankingService: string;
    rank: number;
    timestamp: string;
}

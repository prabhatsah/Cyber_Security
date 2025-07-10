"use server"
import React from 'react'
import FrameworksPage from './component/frameworkPage'
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import KBContextProvider from '../../[framework]/(context)/KnowledgeBaseContext';


type TaskEntry = {
  index: string;
  title: string;
  description: string;
  parentId: string | null;
  treatAsParent: boolean;
  id: string;
};

type ParentEntry = TaskEntry & {
  childrenArray: string[];
};

type Pricing = {
  type: 'free' | 'paid' | string; // extend as needed
};

export type Framework = {
  id: string;
  name: string;
  title: string;
  description: string;
  version: string;
  owners: string[]; // list of user IDs
  pricing: Pricing;
  entries: Record<string, TaskEntry>;
  parentEntries: ParentEntry[];
  category: string;
  score: number;
  status: 'draft' | 'published' | 'archived' | string; // extend as needed
  isFavorite: boolean;
  activityLog: {createBy: string, createdAt: string, message: string}[]
};

const owners = [
    { id: "1", name: "John Smith", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: "2", name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: "3", name: "Mike Wilson", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: "4", name: "Emily Brown", avatar: "https://i.pravatar.cc/150?u=4" },
];

export async function getUserDetailMap() {
  const allUsers = await getUserIdWiseUserDetailsMap();
  return allUsers;
}

export async function CreateUserMap() {
  const allUsers = await getUserDetailMap();
  const userIdNameMap: { value: string; label: string }[] = Object.values(allUsers)
    .map((user) => {
      if (user.userActive) {
        return {
          value: user.userId,
          label: user.userName
        };
      }
      return undefined;
    })
    .filter((user): user is { value: string; label: string } => user !== undefined);

  return userIdNameMap;
}

export async function getFrameworkDetails() {
  const frameworkProcessInstances = await getMyInstancesV2({
    processName: "Framework Processes",
    predefinedFilters: { taskName: "View Framework" }
  })
  const frameworkProcessDatas = frameworkProcessInstances.length > 0 ? frameworkProcessInstances.map((frameworkProcessInstance) => frameworkProcessInstance.data) as Framework[] : [];
  return frameworkProcessDatas;
}

export default async function GrcHome() {
  const allUsers = await CreateUserMap();
  const frameworkProcessDatas = await getFrameworkDetails();
  console.log(frameworkProcessDatas);
  if(frameworkProcessDatas.length===0){
    return <div>
      No Framework Availabel
    </div>
  }
  const frameworks = [
    ...frameworkProcessDatas,
    // {
    //   id: "iso27001",
    //   title: "ISO 27001",
    //   description:
    //     "Information security management system (ISMS) standard that provides a systematic approach to managing sensitive company information.",
    //   category: "Security",
    //   score: 87, //rename to compliance
    //   status: "published",
    //   isFavorite: true,
    //   lastAccessed: "2024-03-08T10:00:00.000Z",
    //   owners: [owners[0], owners[1]],
    // },
    // {
    //   id: "gdpr",
    //   title: "GDPR",
    //   description:
    //     "General Data Protection Regulation that standardizes data protection law across the EU and strengthens the rights of individuals.",
    //   category: "Privacy",
    //   score: 92,
    //   status: "published",
    //   isFavorite: true,
    //   lastAccessed: "2024-03-09T10:00:00.000Z",
    //   owners: [owners[1], owners[2]],
    // },
    // {
    //   id: "pci-dss",
    //   title: "PCI DSS",
    //   description:
    //     "Payment Card Industry Data Security Standard to enhance payment card data security and reduce fraud.",
    //   category: "Security",
    //   score: 78,
    //   status: "published",
    //   lastAccessed: "2024-03-05T10:00:00.000Z",
    //   owners: [owners[0], owners[3]],
    // },
    // {
    //   id: "hipaa",
    //   title: "HIPAA",
    //   description:
    //     "Health Insurance Portability and Accountability Act that provides data privacy and security provisions for safeguarding medical information.",
    //   category: "Privacy",
    //   score: 94,
    //   status: "published",
    //   lastAccessed: "2024-03-03T10:00:00.000Z",
    //   owners: [owners[2]],
    // },
    // {
    //   id: "sox",
    //   title: "SOX",
    //   description:
    //     "Sarbanes-Oxley Act that mandates strict reforms to improve financial disclosures and prevent accounting fraud.",
    //   category: "Governance",
    //   score: 85,
    //   status: "published",
    //   owners: [owners[1]],
    // },
    // {
    //   id: "nist-csf",
    //   title: "NIST CSF",
    //   description:
    //     "Framework for improving critical infrastructure cybersecurity with standards, guidelines, and best practices.",
    //   category: "Security",
    //   score: 81,
    //   status: "draft",
    //   isFavorite: false,
    //   lastModified: "2024-03-09T08:00:00.000Z",
    //   owners: [owners[0], owners[2]],
    // },
    // {
    //   id: "cmmc",
    //   title: "CMMC",
    //   description:
    //     "Cybersecurity Maturity Model Certification for Defense Industrial Base cybersecurity assessments.",
    //   category: "Security",
    //   score: 63,
    //   status: "draft",
    //   lastModified: "2024-03-08T10:00:00.000Z",
    //   owners: [owners[3]],
    // },
    // {
    //   id: "fedramp",
    //   title: "FedRAMP",
    //   description:
    //     "Federal Risk and Authorization Management Program for security assessment and authorization for cloud services.",
    //   category: "Security",
    //   score: 76,
    //   status: "published",
    //   publishedAt: "2024-02-15T10:00:00.000Z",
    //   owners: [owners[1], owners[2]],
    // },
  ]
  return (
    <>
      <KBContextProvider>
        <FrameworksPage allUsers={allUsers} frameworks={frameworks} />
      </KBContextProvider>
    </>
  )
}

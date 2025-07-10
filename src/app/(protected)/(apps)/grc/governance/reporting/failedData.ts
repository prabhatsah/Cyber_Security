import { v4 } from 'uuid';

export const failedControlDatas = [
    {
        controlNo: v4(),
        frameWorkName: "Business Continuitu Management",
        auditType: "Rules and Regulation",
        controlObjective: "Organizational controls",
        controlWeightage: "1",
        controlName: "Segregation of duties",
        controlDefinition: "Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur.",
        assignee: "Pal",
        status: "Failed"
    },


    {
        controlNo: v4(),
        frameWorkName: "Information Security Management System",
        auditType: "Best Practice",
        controlObjective: "People controls",
        controlWeightage: "1",
        controlName: "Screening",
        controlDefinition: "Background verification checks on all candcontrolNoates to become personnel shall be carried out prior to joining the organization and on an ongoing basis taking into conscontrolNoeration applicable laws, regulations and ethics and be proportional to the business requirements, the classification of the information to be accessed and the perceived risks.",
        assignee: "Pal",
        status: "Failed"
    },

]
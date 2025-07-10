import { v4 } from 'uuid';

export const controlsDatas = [
    {
        controlNo: v4(),
        frameWorkName: "Information Security Management System",
        controlWeightage: "1",
        auditType: "Best Practice",
        controlName: "Policies for information security",
        controlObjective: "Organizational controls",
        controlDefinition: "Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur."
    },
    {
        controlNo: v4(),
        frameWorkName: "Risk Management",
        auditType: "Standard Practice",
        controlObjective: "Organizational controls",
        controlWeightage: "1",
        controlName: "Information security roles and responsibilities",
        controlDefinition: "Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur."
    },
    {
        controlNo: v4(),
        frameWorkName: "Business Continuitu Management",
        auditType: "Rules and Regulation",
        controlObjective: "Organizational controls",
        controlWeightage: "1",
        controlName: "Segregation of duties",
        controlDefinition: "Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur."
    },


    {
        controlNo: v4(),
        frameWorkName: "Information Security Management System",
        auditType: "Best Practice",
        controlObjective: "People controls",
        controlWeightage: "1",
        controlName: "Screening",
        controlDefinition: "Background verification checks on all candcontrolNoates to become personnel shall be carried out prior to joining the organization and on an ongoing basis taking into conscontrolNoeration applicable laws, regulations and ethics and be proportional to the business requirements, the classification of the information to be accessed and the perceived risks."
    },
    {
        controlNo: v4(),
        frameWorkName: "Risk Management",
        auditType: "Standard Practice",
        controlObjective: "People controls",
        controlWeightage: "1",
        controlName: "Terms and conditions of employment",
        controlDefinition: "The employment contractual agreements shall state the personnel’s and the organization’s responsibilities for information security."
    },
    {
        controlNo: v4(),
        frameWorkName: "Business Continuitu Management",
        auditType: "Rules and Regulation",
        controlObjective: "People controls",
        controlWeightage: "1",
        controlName: "Information security awareness, education and training",
        controlDefinition: "Personnel of the organization and relevant interested parties shall receive appropriate information security awareness, education and training and regular updates of the organization's information security policy, topic-specific policies and procedures, as relevant for their job function."
    },

];
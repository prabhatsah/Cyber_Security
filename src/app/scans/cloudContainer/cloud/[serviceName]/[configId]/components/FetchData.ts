// import { GoogleCloudConnection } from "@/app/api/cloud-container/google-cloud-platform/googleCloud";

// export default async function FetchGCPData({
//   params,
// }: {
//   params: Promise<{ projectId: string; serviceAccountKey: File | null }>;
// }) {
//   const { projectId, serviceAccountKey } = await params;
//   const result = await GoogleCloudConnection(projectId, serviceAccountKey);
//   if (result.success) {
//     return result;
//   } else {
//   }
// }

export default async function FetchGCPData() {
  const scanData = {
    account_id: "cordova-358e9",
    all_projects: false,
    environment: "default",
    folder_id: null,
    last_run: {
      ruleset_about:
        "This ruleset consists of numerous rules that are considered standard by NCC Group. The rules enabled range from violations of well-known security best practices to gaps resulting from less-known security implications of provider-specific mechanisms. Additional rules exist, some of them requiring extra-parameters to be configured, and some of them being applicable to a limited number of users.",
      ruleset_name: "default",
      run_parameters: {
        excluded_regions: [],
        regions: [],
        services: [],
        skipped_services: [],
      },
      summary: {
        bigquery: {
          checked_items: 0,
          flagged_items: 0,
          max_level: "warning",
          resources_count: 0,
          rules_count: 3,
        },
        cloudmemorystore: {
          checked_items: 0,
          flagged_items: 0,
          max_level: "warning",
          resources_count: 0,
          rules_count: 2,
        },
        cloudsql: {
          checked_items: 0,
          flagged_items: 0,
          max_level: "warning",
          resources_count: 0,
          rules_count: 18,
        },
        cloudstorage: {
          checked_items: 0,
          flagged_items: 0,
          max_level: "warning",
          resources_count: 0,
          rules_count: 6,
        },
        computeengine: {
          checked_items: 0,
          flagged_items: 0,
          max_level: "warning",
          resources_count: 0,
          rules_count: 25,
        },
        dns: {
          checked_items: 0,
          flagged_items: 0,
          max_level: "warning",
          resources_count: 0,
          rules_count: 3,
        },
        functions: {
          checked_items: 0,
          flagged_items: 0,
          max_level: "warning",
          resources_count: 0,
          rules_count: 7,
        },
        iam: {
          checked_items: 2,
          flagged_items: 0,
          max_level: "warning",
          resources_count: 1,
          rules_count: 12,
        },
        kms: {
          checked_items: 0,
          flagged_items: 0,
          max_level: "warning",
          resources_count: 0,
          rules_count: 2,
        },
        kubernetesengine: {
          checked_items: 0,
          flagged_items: 0,
          max_level: "warning",
          resources_count: 0,
          rules_count: 28,
        },
        stackdriverlogging: {
          checked_items: 9,
          flagged_items: 9,
          max_level: "warning",
          resources_count: 1,
          rules_count: 9,
        },
        stackdrivermonitoring: {
          checked_items: 8,
          flagged_items: 8,
          max_level: "warning",
          resources_count: 1,
          rules_count: 8,
        },
      },
      time: "2025-02-24 08:41:20+0530",
      version: "5.14.0",
    },
    metadata: {
      compute: {
        computeengine: {
          resources: {
            firewalls: {
              cols: 2,
              count: 0,
              full_path: "services.computeengine.projects.id.firewalls",
              path: "services.computeengine.projects.id.firewalls",
              script: "services.computeengine.projects.firewalls",
            },
            forwarding_rules: {
              cols: 2,
              count: 0,
              full_path:
                "services.computeengine.projects.id.regions.id.forwarding_rules",
              path: "services.computeengine.projects.id.regions.id.forwarding_rules",
              script:
                "services.computeengine.projects.regions.forwarding_rules",
            },
            global_forwarding_rules: {
              cols: 2,
              count: 0,
              full_path:
                "services.computeengine.projects.id.global_forwarding_rules",
              path: "services.computeengine.projects.id.global_forwarding_rules",
              script: "services.computeengine.projects.global_forwarding_rules",
            },
            instances: {
              cols: 2,
              count: 0,
              full_path:
                "services.computeengine.projects.id.zones.id.instances",
              path: "services.computeengine.projects.id.zones.id.instances",
              script: "services.computeengine.projects.zones.instances",
            },
            networks: {
              cols: 2,
              count: 0,
              full_path: "services.computeengine.projects.id.networks",
              path: "services.computeengine.projects.id.networks",
              script: "services.computeengine.projects.networks",
            },
            snapshots: {
              cols: 2,
              count: 0,
              full_path: "services.computeengine.projects.id.snapshots",
              path: "services.computeengine.projects.id.snapshots",
              script: "services.computeengine.projects.snapshots",
            },
            subnetworks: {
              cols: 2,
              count: 0,
              full_path:
                "services.computeengine.projects.id.regions.id.subnetworks",
              path: "services.computeengine.projects.id.regions.id.subnetworks",
              script: "services.computeengine.projects.regions.subnetworks",
            },
          },
        },
        functions: {
          resources: {
            functions_v1: {
              cols: 2,
              count: 0,
              full_path: "services.functions.projects.id.functions_v1",
              path: "services.functions.projects.id.functions_v1",
              script: "services.functions.projects.functions_v1",
            },
            functions_v2: {
              cols: 2,
              count: 0,
              full_path: "services.functions.projects.id.functions_v2",
              path: "services.functions.projects.id.functions_v2",
              script: "services.functions.projects.functions_v2",
            },
          },
        },
        kubernetesengine: {
          resources: {
            clusters: {
              cols: 2,
              count: 0,
              full_path: "services.kubernetesengine.projects.id.clusters",
              path: "services.kubernetesengine.projects.id.clusters",
              script: "services.kubernetesengine.projects.clusters",
            },
          },
        },
      },
      database: {
        bigquery: {
          resources: {
            datasets: {
              cols: 2,
              count: 0,
              full_path: "services.bigquery.projects.id.datasets",
              path: "services.bigquery.projects.id.datasets",
              script: "services.bigquery.projects.datasets",
            },
          },
        },
        cloudmemorystore: {
          resources: {
            redis_instances: {
              cols: 2,
              count: 0,
              full_path:
                "services.cloudmemorystore.projects.id.redis_instances",
              path: "services.cloudmemorystore.projects.id.redis_instances",
              script: "services.cloudmemorystore.projects.redis_instances",
            },
          },
        },
        cloudsql: {
          resources: {
            instances: {
              cols: 2,
              count: 0,
              full_path: "services.cloudsql.projects.id.instances",
              path: "services.cloudsql.projects.id.instances",
              script: "services.cloudsql.projects.instances",
            },
          },
        },
      },
      management: {
        stackdriverlogging: {
          resources: {
            logging_metrics: {
              cols: 2,
              count: 1,
              full_path:
                "services.stackdriverlogging.projects.id.logging_metrics",
              path: "services.stackdriverlogging.projects.id.logging_metrics",
              script: "services.stackdriverlogging.projects.logging_metrics",
            },
            metrics: {
              cols: 2,
              count: 0,
              full_path: "services.stackdriverlogging.projects.id.metrics",
              path: "services.stackdriverlogging.projects.id.metrics",
              script: "services.stackdriverlogging.projects.metrics",
            },
            sinks: {
              cols: 2,
              count: 0,
              full_path: "services.stackdriverlogging.projects.id.sinks",
              path: "services.stackdriverlogging.projects.id.sinks",
              script: "services.stackdriverlogging.projects.sinks",
            },
          },
        },
        stackdrivermonitoring: {
          resources: {
            alert_policies: {
              cols: 2,
              count: 0,
              full_path:
                "services.stackdrivermonitoring.projects.id.alert_policies",
              path: "services.stackdrivermonitoring.projects.id.alert_policies",
              script: "services.stackdrivermonitoring.projects.alert_policies",
            },
            monitoring_alert_policies: {
              cols: 2,
              count: 1,
              full_path:
                "services.stackdrivermonitoring.projects.id.monitoring_alert_policies",
              path: "services.stackdrivermonitoring.projects.id.monitoring_alert_policies",
              script:
                "services.stackdrivermonitoring.projects.monitoring_alert_policies",
            },
            uptime_checks: {
              cols: 2,
              count: 0,
              full_path:
                "services.stackdrivermonitoring.projects.id.uptime_checks",
              path: "services.stackdrivermonitoring.projects.id.uptime_checks",
              script: "services.stackdrivermonitoring.projects.uptime_checks",
            },
          },
        },
      },
      network: {
        dns: {
          resources: {
            managed_zones: {
              cols: 2,
              count: 0,
              full_path: "services.dns.projects.id.managed_zones",
              path: "services.dns.projects.id.managed_zones",
              script: "services.dns.projects.managed_zones",
            },
          },
        },
      },
      security: {
        iam: {
          resources: {
            bindings: {
              cols: 2,
              count: 0,
              full_path: "services.iam.projects.id.bindings",
              path: "services.iam.projects.id.bindings",
              script: "services.iam.projects.bindings",
            },
            bindings_separation_duties: {
              cols: 2,
              count: 1,
              full_path: "services.iam.projects.id.bindings_separation_duties",
              path: "services.iam.projects.id.bindings_separation_duties",
              script: "services.iam.projects.bindings_separation_duties",
            },
            domains: {
              cols: 2,
              count: 0,
              full_path: "services.iam.projects.id.domains",
              path: "services.iam.projects.id.domains",
              script: "services.iam.projects.domains",
            },
            groups: {
              cols: 2,
              count: 0,
              full_path: "services.iam.projects.id.groups",
              path: "services.iam.projects.id.groups",
              script: "services.iam.projects.groups",
            },
            service_accounts: {
              cols: 2,
              count: 0,
              full_path: "services.iam.projects.id.service_accounts",
              path: "services.iam.projects.id.service_accounts",
              script: "services.iam.projects.service_accounts",
            },
            users: {
              cols: 2,
              count: 0,
              full_path: "services.iam.projects.id.users",
              path: "services.iam.projects.id.users",
              script: "services.iam.projects.users",
            },
          },
        },
        kms: {
          resources: {
            keyrings: {
              cols: 2,
              count: 0,
              full_path: "services.kms.projects.id.keyrings",
              path: "services.kms.projects.id.keyrings",
              script: "services.kms.projects.keyrings",
            },
          },
        },
      },
      storage: {
        cloudstorage: {
          resources: {
            buckets: {
              cols: 2,
              count: 0,
              full_path: "services.cloudstorage.projects.id.buckets",
              path: "services.cloudstorage.projects.id.buckets",
              script: "services.cloudstorage.projects.buckets",
            },
          },
        },
      },
    },
    organization_id: null,
    project_id: "cordova-358e9",
    provider_code: "gcp",
    provider_name: "Google Cloud Platform",
    result_format: "json",
    service_list: [
      "cloudsql",
      "cloudmemorystore",
      "cloudstorage",
      "computeengine",
      "functions",
      "bigquery",
      "iam",
      "kms",
      "stackdriverlogging",
      "stackdrivermonitoring",
      "kubernetesengine",
      "dns",
    ],
    services: {
      bigquery: {
        datasets_count: 0,
        filters: {},
        findings: {
          "bigquery-dataset-allAuthenticatedUsers": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Datasets",
            description: 'Datasets Accessible by "allAuthenticatedUsers"',
            display_path: "bigquery.projects.id.datasets.id",
            flagged_items: 0,
            id_suffix: "permissions",
            items: [],
            level: "danger",
            path: "bigquery.projects.id.datasets.id",
            rationale:
              "Allowing anonymous and/or public access grants permissions to anyone to access the dataset's content. Such access might not be desired if you are storing any sensitive data. Hence, ensure that anonymous and/or public access to a dataset is not allowed.",
            references: null,
            remediation:
              "Delete any permissions assigned to the <samp>allUsers</samp> and <samp>allAuthenticatedUsers</samp> members.",
            service: "BigQuery",
          },
          "bigquery-dataset-allUsers": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Datasets",
            description: 'Datasets Accessible by "allUsers"',
            display_path: "bigquery.projects.id.datasets.id",
            flagged_items: 0,
            id_suffix: "permissions",
            items: [],
            level: "danger",
            path: "bigquery.projects.id.datasets.id",
            rationale:
              "Allowing anonymous and/or public access grants permissions to anyone to access the dataset's content. Such access might not be desired if you are storing any sensitive data. Hence, ensure that anonymous and/or public access to a dataset is not allowed.",
            references: null,
            remediation:
              "Delete any permissions assigned to the <samp>allUsers</samp> and <samp>allAuthenticatedUsers</samp> members.",
            service: "BigQuery",
          },
          "bigquery-encryption-no-cmk": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Datasets",
            description:
              "Dataset Not Encrypted with Customer-Managed Keys (CMKs)",
            display_path: "bigquery.projects.id.datasets.id",
            flagged_items: 0,
            id_suffix: "default_encryption_configuration",
            items: [],
            level: "warning",
            path: "bigquery.projects.id.datasets.id",
            rationale:
              "Encrypting datasets with Cloud KMS Customer-Managed Keys (CMKs) will allow for a more granular control over data encryption/decryption process.",
            references: null,
            remediation: null,
            service: "BigQuery",
          },
        },
        projects: {
          "cordova-358e9": {
            datasets: {},
            datasets_count: 0,
          },
        },
      },
      cloudmemorystore: {
        filters: {},
        findings: {
          "memorystore-redis-instance-auth-not-enabled": {
            checked_items: 0,
            compliance: [],
            dashboard_name: "Redis Instances",
            description: "Memory Instance Allows Unauthenticated Connections",
            flagged_items: 0,
            id_suffix: "auth_enabled",
            items: [],
            level: "warning",
            path: "cloudmemorystore.projects.id.redis_instances.id",
            rationale:
              "All incoming connections to Cloud Memorystore databases should require the use of authentication and SSL.",
            references: [
              "https://cloud.google.com/memorystore/docs/redis/managing-auth",
            ],
            remediation: null,
            service: "Cloud Memorystore",
          },
          "memorystore-redis-instance-ssl-not-required": {
            checked_items: 0,
            compliance: [],
            dashboard_name: "Redis Instances",
            description:
              "Memory Instance Not Requiring SSL for Incoming Connections",
            flagged_items: 0,
            id_suffix: "ssl_required",
            items: [],
            level: "warning",
            path: "cloudmemorystore.projects.id.redis_instances.id",
            rationale:
              "All incoming connections to Cloud Memorystore databases should require the use of SSL.",
            references: [
              "https://cloud.google.com/memorystore/docs/redis/securing-tls-connections",
            ],
            remediation: null,
            service: "Cloud Memorystore",
          },
        },
        projects: {
          "cordova-358e9": {
            redis_instances: {},
            redis_instances_count: 0,
          },
        },
        redis_instances_count: 0,
      },
      cloudsql: {
        filters: {},
        findings: {
          "cloudsql-allows-root-login-from-any-host": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.4",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Instances",
            description: "Instance Allows Root Login from Any Host",
            flagged_items: 0,
            id_suffix: "root_access_from_any_host",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "Root access to MySQL Database Instances should be allowed only through trusted IPs.",
            references: [
              "https://forsetisecurity.org/docs/latest/concepts/best-practices.html#cloud-sql",
              "https://cloud.google.com/blog/products/gcp/best-practices-for-securing-your-google-cloud-databases",
            ],
            remediation: null,
            service: "Cloud SQL",
          },
          "cloudsql-instance-backups-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.7",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description: "Instance with Automatic Backups Disabled",
            flagged_items: 0,
            id_suffix: "automatic_backup_enabled",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "Backups provide a way to restore a Cloud SQL instance to recover lost data or recover from a problem with that instance. Automated backups need to be set for any instance that contains data that should be protected from loss or damage.",
            references: [
              "https://cloud.google.com/sql/docs/mysql/backup-recovery/backups",
              "https://cloud.google.com/sql/docs/postgres/backup-recovery/backing-up",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Select the instance where the backups need to be configured.</li><li>Click <samp>Edit</samp></li><li>In the <samp>Backups</samp> section, check `Enable automated backups', and choose a backup window.</li><li>Click <samp>Save</samp></li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-instance-is-open-to-public-range": {
            checked_items: 0,
            compliance: [],
            dashboard_name: "Authorized Networks",
            description:
              "Database Instances Allowing Access from Public Ranges",
            display_path: "cloudsql.projects.id.instances.id",
            flagged_items: 0,
            id_suffix: "open_to_the_world",
            items: [],
            level: "danger",
            path: "cloudsql.projects.id.instances.id.authorized_networks.id",
            rationale:
              "To minimize attack surface on a Database server instance, only trusted/known and required IP(s) should be allow-listed to connect to it. An authorized network should not have IPs/networks configured to broad public ranges which will allow access to the instance from arbitrary hosts.",
            references: [
              "https://cloud.google.com/sql/docs/mysql/configure-ip",
              "https://console.cloud.google.com/iam-admin/orgpolicies/sql-restrictAuthorizedNetworks",
              "https://cloud.google.com/resource-manager/docs/organization-policy/org-policy-constraints",
              "https://cloud.google.com/sql/docs/mysql/connection-org-policy",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Click the instance name to open its Instance details page.</li><li>Under the <samp>Configuration</samp> section click <samp>Edit configurations</samp>.</li><li>Under <samp>Configuration options</samp> expand the <samp>Connectivity</samp> section.</li><li>Click the <samp>delete</samp> icon for the egregious authorized network</li><li>Click <samp>Save</samp> to update the instance.</li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-instance-is-open-to-the-world": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.2",
                version: "1.0.0",
              },
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.5",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Authorized Networks",
            description:
              "Database Instances Allowing Public Access (0.0.0.0/0)",
            display_path: "cloudsql.projects.id.instances.id",
            flagged_items: 0,
            id_suffix: "open_to_the_world",
            items: [],
            level: "danger",
            path: "cloudsql.projects.id.instances.id.authorized_networks.id",
            rationale:
              "To minimize attack surface on a Database server instance, only trusted/known and required IP(s) should be allow-listed to connect to it. An authorized network should not have IPs/networks configured to 0.0.0.0/0 which will allow access to the instance from anywhere in the world.",
            references: [
              "https://cloud.google.com/sql/docs/mysql/configure-ip",
              "https://console.cloud.google.com/iam-admin/orgpolicies/sql-restrictAuthorizedNetworks",
              "https://cloud.google.com/resource-manager/docs/organization-policy/org-policy-constraints",
              "https://cloud.google.com/sql/docs/mysql/connection-org-policy",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Click the instance name to open its Instance details page.</li><li>Under the <samp>Configuration</samp> section click <samp>Edit configurations</samp>.</li><li>Under <samp>Configuration options</samp> expand the <samp>Connectivity</samp> section.</li><li>Click the <samp>delete</samp> icon for the authorized network <samp>0.0.0.0/0.</samp></li><li>Click <samp>Save</samp> to update the instance.</li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-instance-no-binary-logging": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Instances",
            description: "Instance with Binary Logging Disabled",
            flagged_items: 0,
            id_suffix: "log_enabled",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "The benefits of enabling binary logs (replication, scalability, auditability, point-in-time data recovery, etc.) can improve the security posture of the Cloud SQL instance.",
            references: [
              "https://cloud.google.com/sql/docs/mysql/instance-settings",
              "https://cloud.google.com/sql/docs/mysql/replication/tips",
            ],
            remediation: null,
            service: "Cloud SQL",
          },
          "cloudsql-instance-ssl-not-required": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.1",
                version: "1.0.0",
              },
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.4",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description:
              "Instance Not Requiring Mutual TLS Authentication for Incoming Connections",
            flagged_items: 0,
            id_suffix: "ssl_required",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "SQL database connections if successfully trapped (MITM) can reveal sensitive data such as credentials, database queries, query outputs etc. For improved security, it is recommended to require mutual authentication, which involves using certificates to authenticate both the client and server.",
            references: [
              "https://cloud.google.com/sql/docs/postgres/configure-ssl-instance",
            ],
            remediation:
              "From console:<ol><li>Go to  https://console.cloud.google.com/sql/instances.</li><li>Click on an instance name to see its configuration overview.</li><li>In the left-side panel, select <samp>Connections</samp></li><li>In the <samp>SSL connections</samp> section, click <samp>Allow only SSL connections.</samp></li><li>Under <samp>Configure SSL server certificates</samp> click <samp>Create new certificate.</samp></li><li>Under <samp>Configure SSL server certificates</samp> click <samp>Create a client certificate.</samp></li><li>Follow the instructions shown to learn how to connect to your instance.</li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-instance-with-no-backups": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Instances",
            description: "Instance with No Backups",
            flagged_items: 0,
            id_suffix: "last_backup_timestamp",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "Weekly or monthly backups should be created of all databases holding sensitive information.",
            references: [
              "https://cloud.google.com/sql/docs/mysql/backup-recovery/backups",
            ],
            remediation: null,
            service: "Cloud SQL",
          },
          "cloudsql-instances-public-ips": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.6",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description: "Database Instances with Public IPs",
            flagged_items: 0,
            id_suffix: "public_ip",
            items: [],
            level: "danger",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "To lower the organization's attack surface, Cloud SQL databases should not have public IPs. Private IPs provide improved network security and lower latency for your application.",
            references: [
              "https://cloud.google.com/sql/docs/mysql/configure-private-ip",
              "https://cloud.google.com/sql/docs/mysql/private-ip",
              "https://cloud.google.com/resource-manager/docs/organization-policy/org-policy-constraints",
              "https://console.cloud.google.com/iam-admin/orgpolicies/sql-restrictPublicIp",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Click the instance name to open its Instance details page.</li><li>Select the <samp>Connections</samp> tab.</li><li>Deselect the <samp>Public IP</samp> checkbox.</li><li>Click <samp>Save</samp> to update the instance.</li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-mysql-instances-local-infile-on": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.1.2",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description: "Local Infile Database Flag for MySQL Instance Is on",
            flagged_items: 0,
            id_suffix: "local_infile_off",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "The local_infile flag controls the server-side LOCAL capability for LOAD DATA statements. Depending on the local_infile setting, the server refuses or permits local data loading by clients that have LOCAL enabled on the client side. To explicitly cause the server to refuse LOAD DATA LOCAL statements (regardless of how client programs and libraries are configured at build time or runtime), start mysqld with local_infile disabled. local_infile can also be set at runtime.",
            references: [
              "https://cloud.google.com/sql/docs/mysql/flags",
              "https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_local_infile",
              "https://dev.mysql.com/doc/refman/5.7/en/load-data-local.html",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Select the MySQL instance where the database flag needs to be enabled.</li><li>Click <samp>Edit</samp></li><li>Scroll down to the <samp>Flags</samp> section.</li><li>To set a flag that has not been set on the instance before, click <samp>Add item</samp>, choose the flag <samp>local_infile</samp> from the drop-down menu, and set its value to <samp>off</samp>.</li><li>Click <samp>Save</samp></li><li>Confirm the changes under <samp>Flags</samp> on the Overview page.</li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-postgresql-instances-log-checkpoints-off": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.2.1",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description:
              "Log Checkpoints Database Flag for PostgreSQL Instance Is off",
            flagged_items: 0,
            id_suffix: "log_checkpoints_on",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "Enabling log_checkpoints causes checkpoints and restart points to be logged in the server log. Some statistics are included in the log messages, including the number of buffers written and the time spent writing them. This parameter can only be set in the postgresql.conf file or on the server command line. This recommendation is applicable to PostgreSQL database instances.",
            references: [
              "https://www.postgresql.org/docs/9.6/runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT",
              "https://cloud.google.com/sql/docs/postgres/flags#setting_a_database_flag",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Select the PostgreSQL instance where the database flag needs to be enabled.</li><li>Click <samp>Edit</samp></li><li>Scroll down to the <samp>Flags</samp> section.</li><li>To set a flag that has not been set on the instance before, click <samp>Add item</samp>, choose the flag <samp>log_checkpoints</samp> from the drop-down menu, and set its value to <samp>off</samp>.</li><li>Click <samp>Save</samp></li><li>Confirm the changes under <samp>Flags</samp> on the Overview page.</li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-postgresql-instances-log-connections-off": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.2.2",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description:
              "Log Connections Database Flag for PostgreSQL Instance Is off",
            flagged_items: 0,
            id_suffix: "log_connections_on",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "PostgreSQL does not log attempted connections by default. Enabling the log_connections setting will create log entries for each attempted connection as well as successful completion of client authentication which can be useful in troubleshooting issues and to determine any unusual connection attempts to the server. This recommendation is applicable to PostgreSQL database instances.",
            references: [
              "https://www.postgresql.org/docs/9.6/runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT",
              "https://cloud.google.com/sql/docs/postgres/flags",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Select the PostgreSQL instance where the database flag needs to be enabled.</li><li>Click <samp>Edit</samp></li><li>Scroll down to the <samp>Flags</samp> section.</li><li>To set a flag that has not been set on the instance before, click <samp>Add item</samp>, choose the flag <samp>log_connections</samp> from the drop-down menu, and set its value to <samp>off</samp>.</li><li>Click <samp>Save</samp></li><li>Confirm the changes under <samp>Flags</samp> on the Overview page.</li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-postgresql-instances-log-disconnections-off": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.2.3",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description:
              "Log Disconnections Database Flag for PostgreSQL Instance Is off",
            flagged_items: 0,
            id_suffix: "log_disconnections_on",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "PostgreSQL does not log session details such as duration and session end by default. Enabling the log_disconnections setting will create log entries at the end of each session which can be useful in troubleshooting issues and determine any unusual activity across a time period. The log_disconnections and log_connections work hand in hand and generally, the pair would be enabled/disabled together. This recommendation is applicable to PostgreSQL database instances.",
            references: [
              "https://www.postgresql.org/docs/9.6/runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT",
              "https://cloud.google.com/sql/docs/postgres/flags",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Select the PostgreSQL instance where the database flag needs to be enabled.</li><li>Click <samp>Edit</samp></li><li>Scroll down to the <samp>Flags</samp> section.</li><li>To set a flag that has not been set on the instance before, click <samp>Add item</samp>, choose the flag <samp>log_disconnections</samp> from the drop-down menu, and set its value to <samp>off</samp>.</li><li>Click <samp>Save</samp></li><li>Confirm the changes under <samp>Flags</samp> on the Overview page.</li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-postgresql-instances-log-lock-waits-off": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.2.4",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description:
              "Log Lock Waits Database Flag for PostgreSQL Instance Is off",
            flagged_items: 0,
            id_suffix: "log_lock_waits_on",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "The deadlock timeout defines the time to wait on a lock before checking for any conditions. Frequent run overs on deadlock timeout can be an indication of an underlying issue. Logging such waits on locks by enabling the log_lock_waits flag can be used to identify poor performance due to locking delays or if a specially-crafted SQL is attempting to starve resources through holding locks for excessive amounts of time. This recommendation is applicable to PostgreSQL database instances.",
            references: [
              "https://www.postgresql.org/docs/9.6/runtime-config-logging.html#GUC-LOG-MIN-DURATION-STATEMENT",
              "https://cloud.google.com/sql/docs/postgres/flags",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Select the PostgreSQL instance where the database flag needs to be enabled.</li><li>Click <samp>Edit</samp></li><li>Scroll down to the <samp>Flags</samp> section.</li><li>To set a flag that has not been set on the instance before, click <samp>Add item</samp>, choose the flag <samp>log_lock_waits</samp> from the drop-down menu, and set its value to <samp>off</samp>.</li><li>Click <samp>Save</samp></li><li>Confirm the changes under <samp>Flags</samp> on the Overview page.</li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-postgresql-instances-log-min-duration-not-set-1": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.2.7",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description:
              "Log Min Duration Statement Database Flag for PostgreSQL Instance Is Not Set to -1",
            flagged_items: 0,
            id_suffix: "log_min_duration_statement_-1",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "Logging SQL statements may include sensitive information that should not be recorded in logs. This recommendation is applicable to PostgreSQL database instances.",
            references: [
              "https://www.postgresql.org/docs/current/runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT",
              "https://cloud.google.com/sql/docs/postgres/flags",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Select the PostgreSQL instance where the database flag needs to be enabled.</li><li>Click <samp>Edit</samp></li><li>Scroll down to the <samp>Flags</samp> section.</li><li>To set a flag that has not been set on the instance before, click <samp>Add item</samp>, choose the flag <samp>log_min_duration_statement</samp> from the drop-down menu, and set its value to <samp>-1</samp>.</li><li>Click <samp>Save</samp></li><li>Confirm the changes under <samp>Flags</samp> on the Overview page.</li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-postgresql-instances-log-min-messages-not-set": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.2.5",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description:
              "Log Min Messages Database Flag for PostgreSQL Instance Is Not Set",
            flagged_items: 0,
            id_suffix: "log_min_messages",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "Auditing helps in troubleshooting operational problems and also permits forensic analysis. If log_min_error_statement is not set to the correct value, messages may not be classified as error messages appropriately. Considering general log messages as error messages would make it difficult to find actual errors, while considering only stricter severity levels as error messages may skip actual errors to log their SQL statements. The log_min_error_statement flag should be set in accordance with the organization's logging policy. This recommendation is applicable to PostgreSQL database instances.",
            references: [
              "https://www.postgresql.org/docs/9.6/runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHEN",
              "https://cloud.google.com/sql/docs/postgres/flags",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Select the PostgreSQL instance where the database flag needs to be enabled.</li><li>Click <samp>Edit</samp></li><li>Scroll down to the <samp>Flags</samp> section.</li><li>To set a flag that has not been set on the instance before, click <samp>Add item</samp>, choose the flag <samp>log_min_error_statement</samp> from the drop-down menu, and set appropriate value.</li><li>Click <samp>Save</samp></li><li>Confirm the changes under <samp>Flags</samp> on the Overview page.</li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-postgresql-instances-log-temp-files-not-set-0": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.2.6",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description:
              "Log Temp Files Database Flag for PostgreSQL Instance Is Not Set to 0",
            flagged_items: 0,
            id_suffix: "log_temp_files_0",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "If all temporary files are not logged, it may be more difficult to identify potential performance issues that may be due to either poor application coding or deliberate resource starvation attempts.",
            references: [
              "https://www.postgresql.org/docs/9.6/runtime-config-logging.html#GUC-LOG-TEMP-FILES",
              "https://cloud.google.com/sql/docs/postgres/flags",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Select the PostgreSQL instance where the database flag needs to be enabled.</li><li>Click <samp>Edit</samp></li><li>Scroll down to the <samp>Flags</samp> section.</li><li>To set a flag that has not been set on the instance before, click <samp>Add item</samp>, choose the flag <samp>log_temp_files</samp> from the drop-down menu, and set its value to <samp>0</samp>.</li><li>Click <samp>Save</samp></li><li>Confirm the changes under <samp>Flags</samp> on the Overview page.</li></ol>",
            service: "Cloud SQL",
          },
          "cloudsql-sqlservers-instances-contained-database-authentication-on":
            {
              checked_items: 0,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "6.3.2",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Instances",
              description:
                "Contained Database Authentication Database Flag for SQLServers Instance Is on",
              flagged_items: 0,
              id_suffix: "contained_database_authentication_off",
              items: [],
              level: "warning",
              path: "cloudsql.projects.id.instances.id",
              rationale:
                "A contained database includes all database settings and metadata required to define the database and has no configuration dependencies on the instance of the Database Engine where the database is installed. Users can connect to the database without authenticating a login at the Database Engine level. Isolating the database from the Database Engine makes it possible to easily move the database to another instance of SQL Server. Contained databases have some unique threats that should be understood and mitigated by SQL Server Database Engine administrators. Most of the threats are related to the USER WITH PASSWORD authentication process, which moves the authentication boundary from the Database Engine level to the database level, hence this is recommended to disable this flag.",
              references: [
                "https://cloud.google.com/sql/docs/sqlserver/flags",
                "https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/contained-database-authentication-server-configuration-option?view=sql-server-ver15",
                "https://learn.microsoft.com/en-us/sql/relational-databases/databases/security-best-practices-with-contained-databases?view=sql-server-ver15",
              ],
              remediation:
                "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Select the MySQL instance where the database flag needs to be enabled.</li><li>Click <samp>Edit</samp></li><li>Scroll down to the <samp>Flags</samp> section.</li><li>To set a flag that has not been set on the instance before, click <samp>Add item</samp>, choose the flag <samp>contained database authentication</samp> from the drop-down menu, and set its value to <samp>off</samp>.</li><li>Click <samp>Save</samp></li><li>Confirm the changes under <samp>Flags</samp> on the Overview page.</li></ol>",
              service: "Cloud SQL",
            },
          "cloudsql-sqlservers-instances-cross-db-ownership-chaining-on": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "6.3.1",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description:
              "Cross DB Ownership Chaining Database Flag for SQLServers Instance Is on",
            flagged_items: 0,
            id_suffix: "cross_db_ownership_chaining_off",
            items: [],
            level: "warning",
            path: "cloudsql.projects.id.instances.id",
            rationale:
              "Use the cross db ownership for chaining option to configure cross-database ownership chaining for an instance of Microsoft SQL Server. This server option allows you to control cross-database ownership chaining at the database level or to allow cross-database ownership chaining for all databases. Enabling cross db ownership is not recommended unless all of the databases hosted by the instance of SQL Server must participate in cross-database ownership chaining and you are aware of the security implications of this setting. This recommendation is applicable to SQL Server database instances.",
            references: [
              "https://cloud.google.com/sql/docs/sqlserver/flags",
              "https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/cross-db-ownership-chaining-server-configuration-option?view=sql-server-ver15",
            ],
            remediation:
              "From console:<ol><li>Go to the Cloud SQL Instances page in the Google Cloud Console by visiting https://console.cloud.google.com/sql/instances.</li><li>Select the MySQL instance where the database flag needs to be enabled.</li><li>Click <samp>Edit</samp></li><li>Scroll down to the <samp>Flags</samp> section.</li><li>To set a flag that has not been set on the instance before, click <samp>Add item</samp>, choose the flag <samp>cross db ownership chaining</samp> from the drop-down menu, and set its value to <samp>off</samp>.</li><li>Click <samp>Save</samp></li><li>Confirm the changes under <samp>Flags</samp> on the Overview page.</li></ol>",
            service: "Cloud SQL",
          },
        },
        instances_count: 0,
        projects: {
          "cordova-358e9": {
            instances: {},
            instances_count: 0,
          },
        },
      },
      cloudstorage: {
        buckets_count: 0,
        filters: {},
        findings: {
          "cloudstorage-bucket-allAuthenticatedUsers": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "5.1",
                version: "1.0.0",
              },
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "5.1",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Buckets",
            description: 'Bucket Accessible by "allAuthenticatedUsers"',
            display_path: "cloudstorage.projects.id.buckets.id",
            flagged_items: 0,
            id_suffix: "allAuthenticatedUsers",
            items: [],
            level: "danger",
            path: "cloudstorage.projects.id.buckets.id",
            rationale:
              "Allowing anonymous and/or public access grants permissions to anyone to access bucket content. Such access might not be desired if you are storing any sensitive data. Hence, ensure that anonymous and/or public access to a bucket is not allowed.",
            references: [
              "https://cloud.google.com/storage/docs/access-control/iam-reference",
              "https://cloud.google.com/storage/docs/access-control/making-data-public",
              "https://cloud.google.com/storage/docs/gsutil/commands/iam",
            ],
            remediation:
              '"From console:<ol><li>Go to <samp>Storage browser</samp> by visiting https://console.cloud.google.com/storage/browser.</li><li>Click on the bucket name to go to its <samp>Bucket details</samp> page.</li><li>Click on the <samp>Permissions</samp> tab.</li><li>Click <samp>Delete</samp> button in front of <samp>allUsers</samp> and <samp>allAuthenticatedUsers</samp> to remove that particular role assignment.</li></ol>',
            service: "Cloud Storage",
          },
          "cloudstorage-bucket-allUsers": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "5.1",
                version: "1.0.0",
              },
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "5.1",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Buckets",
            description: 'Bucket Accessible by "allUsers"',
            display_path: "cloudstorage.projects.id.buckets.id",
            flagged_items: 0,
            id_suffix: "allUsers",
            items: [],
            level: "danger",
            path: "cloudstorage.projects.id.buckets.id",
            rationale:
              "Allowing anonymous and/or public access grants permissions to anyone to access bucket content. Such access might not be desired if you are storing any sensitive data. Hence, ensure that anonymous and/or public access to a bucket is not allowed.",
            references: [
              "https://cloud.google.com/storage/docs/access-control/iam-reference",
              "https://cloud.google.com/storage/docs/access-control/making-data-public",
              "https://cloud.google.com/storage/docs/gsutil/commands/iam",
            ],
            remediation:
              '"From console:<ol><li>Go to <samp>Storage browser</samp> by visiting https://console.cloud.google.com/storage/browser.</li><li>Click on the bucket name to go to its <samp>Bucket details</samp> page.</li><li>Click on the <samp>Permissions</samp> tab.</li><li>Click <samp>Delete</samp> button in front of <samp>allUsers</samp> and <samp>allAuthenticatedUsers</samp> to remove that particular role assignment.</li></ol>',
            service: "Cloud Storage",
          },
          "cloudstorage-bucket-no-logging": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "5.3",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Buckets",
            description: "Bucket with Logging Disabled",
            flagged_items: 0,
            id_suffix: "logging_enabled",
            items: [],
            level: "warning",
            path: "cloudstorage.projects.id.buckets.id",
            rationale:
              "Enable access and storage logs, in order to capture all events which may affect objects within target buckets.",
            references: ["https://cloud.google.com/storage/docs/access-logs"],
            remediation: null,
            service: "Cloud Storage",
          },
          "cloudstorage-bucket-no-public-access-prevention": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Buckets",
            description: "Bucket with Private Access Prevention Not Enforced",
            flagged_items: 0,
            id_suffix: "public_access_prevention",
            items: [],
            level: "warning",
            path: "cloudstorage.projects.id.buckets.id",
            rationale:
              "Public access prevention protects Cloud Storage buckets and objects from being accidentally exposed to the public. When you enforce public access prevention, no one can make data in applicable buckets public through IAM policies or ACLs.<br><br>Note that even if a bucket does not have public access prevention explicitly enforced in its settings, it might still inherit public access prevention, which occurs if the organization policy constraint <samp>storage.publicAccessPrevention</samp> is set on the project, folder, or organization that the bucket exists within. For this reason, the bucket state can only be set to <samp>enforced</samp> or <samp>inherited</samp>.",
            references: [
              "https://cloud.google.com/storage/docs/public-access-prevention",
            ],
            remediation: null,
            service: "Cloud Storage",
          },
          "cloudstorage-bucket-no-versioning": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Buckets",
            description: "Bucket with Versioning Disabled",
            flagged_items: 0,
            id_suffix: "versioning_enabled",
            items: [],
            level: "warning",
            path: "cloudstorage.projects.id.buckets.id",
            rationale:
              "Enable Object Versioning to protect Cloud Storage data from being overwritten or accidentally deleted.",
            references: [
              "https://cloud.google.com/storage/docs/using-object-versioning",
            ],
            remediation: null,
            service: "Cloud Storage",
          },
          "cloudstorage-uniform-bucket-level-access-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "5.2",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Buckets",
            description: "Uniform Bucket-Level Access Is Disabled",
            display_path: "cloudstorage.projects.id.buckets.id",
            flagged_items: 0,
            id_suffix: "uniform_bucket_level_access",
            items: [],
            level: "warning",
            path: "cloudstorage.projects.id.buckets.id",
            rationale:
              "It is recommended to use uniform bucket-level access to unify and simplify how you grant access to your Cloud Storage resources. In order to support a uniform permissioning system, Cloud Storage has uniform bucket-level access. Using this feature disables ACLs for all Cloud Storage resources: access to Cloud Storage resources then is granted exclusively through Cloud IAM. Enabling uniform bucket-level access guarantees that if a Storage bucket is not publicly accessible, no object in the bucket is publicly accessible either.",
            references: [
              "https://cloud.google.com/storage/docs/uniform-bucket-level-access",
              "https://cloud.google.com/storage/docs/using-uniform-bucket-level-access",
              "https://cloud.google.com/storage/docs/org-policy-constraints#uniform-bucket",
            ],
            remediation:
              "From console:<ol><li>Open the Cloud Storage browser in the Google Cloud Console by visiting: https://console.cloud.google.com/storage/browser</li><li>In the list of buckets, click on the name of the desired bucket.</li><li>Select the <samp>Permissions</samp> tab near the top of the page.</li><li>In the text box that starts with <samp>This bucket uses fine-grained access control</samp>..., click <samp>Edit</samp>.</li><li>In the pop-up menu that appears, select <samp>Uniform</samp>.</li><li>Click <samp>Save</samp>.</li></ol>",
            service: "Cloud Storage",
          },
        },
        projects: {
          "cordova-358e9": {
            buckets: {},
            buckets_count: 0,
          },
        },
      },
      computeengine: {
        filters: {},
        findings: {
          "computeengine-firewall-default-rule-in-use": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Firewall Rule",
            description: "Default Firewall Rule in Use",
            flagged_items: 0,
            id_suffix: "name",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.firewalls.id",
            rationale:
              "Some default firewall rules were in use. This could potentially expose sensitive services or protocols to other networks.",
            references: null,
            remediation: null,
            service: "Compute Engine",
          },
          "computeengine-firewall-rule-allows-all-ports": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Firewall Rule Elements",
            description: "Firewall Rule Opens All Ports (0-65535)",
            display_path: "computeengine.projects.id.firewalls.id",
            flagged_items: 0,
            id_suffix: "permissive_ports",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.firewalls.id.allowed_traffic.id.ports.id",
            rationale:
              "The firewall rule allows access to all ports. This widens the attack surface of the infrastructure and makes it easier for an attacker to reach potentially sensitive services over the network.",
            references: null,
            remediation: null,
            service: "Compute Engine",
          },
          "computeengine-firewall-rule-allows-internal-traffic": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Firewall Rule Elements",
            description: "Firewall Rule Allows Internal Traffic",
            display_path: "computeengine.projects.id.firewalls.id",
            flagged_items: 0,
            id_suffix: "permissive_ports",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.firewalls.id.allowed_traffic.id.ports.id",
            rationale:
              "Firewall rule allows ingress connections for all protocols and ports among instances in the network.",
            references: null,
            remediation: null,
            service: "Compute Engine",
          },
          "computeengine-firewall-rule-allows-port-range": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Firewall Rule Elements",
            description: "Firewall Rule Allows Port Range(s)",
            display_path: "computeengine.projects.id.firewalls.id",
            flagged_items: 0,
            id_suffix: "permissive_ports",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.firewalls.id.allowed_traffic.id.ports.id",
            rationale:
              "It was found that the firewall rule was using port ranges. Sometimes, ranges could include unintended ports that should not be exposed. As a result, when possible, explicit port lists should be used instead.",
            references: null,
            remediation: null,
            service: "Compute Engine",
          },
          "computeengine-firewall-rule-allows-public-access": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Firewall Rules",
            description: "Firewall Rule Allows Public Access (0.0.0.0/0)",
            flagged_items: 0,
            id_suffix: "source_ranges",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.firewalls.id",
            rationale:
              "The firewall rule was found to be exposing potentially open ports to all source addresses. Ports are commonly probed by automated scanning tools, and could be an indicator of sensitive services exposed to Internet. If such services need to be exposed, a restriction on the source address could help to reduce the attack surface of the infrastructure.",
            references: null,
            remediation: null,
            service: "Compute Engine",
          },
          "computeengine-firewall-rule-opens-all-ports-to-all": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Firewall Rule Elements",
            description:
              "Firewall Rule Allows Public Access (0.0.0.0/0) to All Ports (0-65535)",
            display_path: "computeengine.projects.id.firewalls.id",
            flagged_items: 0,
            id_suffix: "permissive_ports",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.firewalls.id.allowed_traffic.id.ports.id",
            rationale:
              "The firewall rule was found to be exposing all ports to all source addresses. Ports are commonly probed by automated scanning tools, and could be an indicator of sensitive services exposed to Internet. If such services need to be exposed, a restriction on the source address could help to reduce the attack surface of the infrastructure.",
            references: null,
            remediation: null,
            service: "Compute Engine",
          },
          "computeengine-firewall-rule-opens-sensitive-port-to-all": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Firewall Rule Elements",
            description:
              "Firewall INGRESS Rule Allows Public Access (0.0.0.0/0) to a Sensitive Port",
            display_path: "computeengine.projects.id.firewalls.id",
            flagged_items: 0,
            id_suffix: "permissive_ports",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.firewalls.id.allowed_traffic.id.ports.id",
            rationale:
              "The firewall rule was found to be exposing a well-known port to all source addresses. Well-known ports are commonly probed by automated scanning tools, and could be an indicator of sensitive services exposed to Internet. If such services need to be exposed, a restriction on the source address could help to reduce the attack surface of the infrastructure.",
            references: null,
            remediation: null,
            service: "Compute Engine",
          },
          "computeengine-instance-block-project-ssh-keys-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "4.3",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description: "Block Project SSH Keys Disabled",
            flagged_items: 0,
            id_suffix: "block_project_ssh_keys_disabled",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.zones.id.instances.id",
            rationale:
              "Project-wide SSH keys are stored in Compute/Project-meta-data. Project wide SSH keys can be used to login into all the instances within project. Using project-wide SSH keys eases the SSH key management but if compromised, poses the security risk which can impact all the instances within project.",
            references: [
              "https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys",
            ],
            remediation:
              "From console:<ol><li>Go to the <samp>VM instances</samp> page by visiting https://console.cloud.google.com/compute/instances.</li><li>Click on the name of the Impacted instance</li><li>Click <samp>Edit</samp> in the toolbar.</li><li>Under SSH Keys, go to the <samp>Block project-wide SSH keys</samp> checkbox.</li><li>To block users with project-wide SSH keys from connecting to this instance, select <samp>Block project-wide SSH keys</samp></li><li>Click <samp>Save</samp> at the bottom of the page</li><li>Repeat steps for every impacted Instance</li></ol>",
            service: "Compute Engine",
          },
          "computeengine-instance-connecting-serial-ports-enabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "4.5",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description: "Enable Connecting to Serial Ports Is Enabled",
            flagged_items: 0,
            id_suffix: "serial_port_enabled",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.zones.id.instances.id",
            rationale:
              "The interactive serial console does not support IP-based access restrictions such as IP allow-lists. If you enable the interactive serial console on an instance, clients can attempt to connect to that instance from any IP address. This allows anybody to connect to that instance if they know the correct SSH key, username, project ID, zone, and instance name.",
            references: [
              "https://cloud.google.com/compute/docs/instances/interacting-with-serial-console",
            ],
            remediation:
              "From console:<ol><li>Login to Google Cloud console</li><li>Go to Computer Engine</li><li>Go to VM instances</li><li>Click on the Specific VM</li><li>Click <samp>Edit</samp></li><li>Unselect <samp>Enable connecting to serial ports</samp> below <samp>Remote access</samp>block.</li><li>Click <samp>Save</samp></li></ol>",
            service: "Compute Engine",
          },
          "computeengine-instance-default-service-account": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "4.1",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description: "Instances Configured to Use Default Service Account",
            flagged_items: 0,
            id_suffix: "service_account",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.zones.id.instances.id",
            rationale:
              "The default Compute Engine service account has the Editor role on the project, which allows read and write access to most Google Cloud Services. To defend against privilege escalations if your VM is compromised and prevent an attacker from gaining access to all of your project, it is recommended to not use the default Compute Engine service account. Instead, you should create a new service account and assigning only the permissions needed by your instance.<br> The default Compute Engine service account is named [PROJECT_NUMBER]-compute@developer.gserviceaccount.com.",
            references: [
              "https://cloud.google.com/compute/docs/access/service-accounts",
              "https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances",
              "https://cloud.google.com/sdk/gcloud/reference/compute/instances/set-service-account",
            ],
            remediation:
              "From console:<ol><li>Go to the <samp>VM instances</samp> page by visiting https://console.cloud.google.com/compute/instances.</li><li>Click on the instance name to go to its <samp>VM instance details</samp> page.</li><li>Click <samp>STOP</samp> and then click <samp>Edit</samp></li><li>Under the section <samp>Service Account</samp>, select a service account other that the default Compute Engine service account. You may first need to create a new service account.</li><li>Click <samp>Save</samp> and then click <samp>START</samp></li></ol>",
            service: "Compute Engine",
          },
          "computeengine-instance-disk-not-csek-encrypted": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "4.7",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description:
              "VM Disks Not Customer-Supplied Encryption Keys (CSEK) Encrypted",
            display_path: "computeengine.projects.id.zones.id.instances.id",
            flagged_items: 0,
            id_suffix: "encrypted_with_csek",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.zones.id.instances.id.disks.id",
            rationale:
              "By default, Google Compute Engine encrypts all data at rest. Compute Engine handles and manages this encryption for you without any additional actions on your part. However, if you wanted to control and manage this encryption yourself, you can provide your own encryption keys.",
            references: [
              "https://cloud.google.com/compute/docs/disks/customer-supplied-encryption#encrypt_a_new_persistent_disk_with_your_own_keys",
              "https://cloud.google.com/compute/docs/reference/rest/v1/disks/get",
              "https://cloud.google.com/compute/docs/disks/customer-supplied-encryption#key_file",
            ],
            remediation:
              "From console:<ol><li>Go to Compute Engine <samp>DIsks</samp> by visiting https://console.cloud.google.com/compute/disks.</li><li>Click <samp>CREATE DISK</samp>.</li><li>Set <samp>Encryption type</samp> to <samp>Customer supplied</samp></li><li>Provide the <samp>Key</samp> in the box.</li><li>Select <samp>Wrapped key</samp>.</li><li>Click <samp>Create</samp></li></ol>",
            service: "Compute Engine",
          },
          "computeengine-instance-disk-with-no-snapshot": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Instances",
            description: "Instance Disk without Snapshots",
            display_path: "computeengine.projects.id.zones.id.instances.id",
            flagged_items: 0,
            id_suffix: "latest_snapshot",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.zones.id.instances.id.disks.id",
            rationale:
              "You should have snapshots of your in-use or available disks taken on a regular basis to enable disaster recovery efforts.",
            references: [
              "https://cloud.google.com/compute/docs/disks/create-snapshots",
              "https://cloud.google.com/compute/docs/disks/scheduled-snapshots",
              "https://cloud.google.com/compute/docs/disks/snapshot-best-practices",
            ],
            remediation: null,
            service: "Compute Engine",
          },
          "computeengine-instance-full-api-access": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "4.2",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description:
              "Instances Configured to Use Default Service Account with Full Access to All Cloud APIs",
            flagged_items: 0,
            id_suffix: "full_access_apis",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.zones.id.instances.id",
            rationale:
              "When an instance is configured with Compute Engine default service account with Scope Allow full access to all Cloud APIs, based on IAM roles assigned to the user(s) accessing Instance, it may allow user to perform cloud operations/API calls that user is not supposed to perform leading to successful privilege escalation.",
            references: [
              "https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances",
              "https://cloud.google.com/compute/docs/access/service-accounts",
            ],
            remediation:
              "From console:<ol><li>Go to the <samp>VM instances</samp> page by visiting https://console.cloud.google.com/compute/instances.</li><li>Click on the impacted VM instance.</li><li>If the instance is not stopped, click the <samp>Stop</samp> button. Wait for the instance to be stopped.</li><li>Next, click the <samp>Edit</samp> button.</li><li>Scroll down to the <samp>Service Account</samp> section.</li><li>Select a different service account or ensure that <samp>Allow full access to all Cloud APIs</samp> is not selected.</li><li>Click the <samp>Save</samp> button to save your changes and then click <samp>START</samp></li></ol>",
            service: "Compute Engine",
          },
          "computeengine-instance-ip-forwarding-enabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "4.6",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description: "IP Forwarding Is Enabled",
            flagged_items: 0,
            id_suffix: "ip_forwarding_enabled",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.zones.id.instances.id",
            rationale:
              "Compute Engine instance cannot forward a packet unless the source IP address of the packet matches the IP address of the instance. Similarly, GCP won't deliver a packet whose destination IP address is different than the IP address of the instance receiving the packet. However, both capabilities are required if you want to use instances to help route packets.",
            references: [
              "https://cloud.google.com/vpc/docs/using-routes#canipforward",
            ],
            remediation:
              "From console:<ol><li>Go to the <samp>VM instances</samp> page by visiting https://console.cloud.google.com/compute/instances.</li><li>Select the <samp>VM Instance</samp> you want to remediate.</li><li>Click the <samp>Delete</samp> button.</li><li>On the 'VM Instances' page, click `CREATE INSTANCE'.</li><li>Create a new instance with the desired configuration. By default, the instance is configured to not allow IP forwarding.</li></ol>",
            service: "Compute Engine",
          },
          "computeengine-instance-os-login-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "4.4",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description: "OS Login Disabled",
            flagged_items: 0,
            id_suffix: "oslogin_disabled",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.zones.id.instances.id",
            rationale:
              "Enabling osLogin ensures that SSH keys used to connect to instances are mapped with IAM users. Revoking access to IAM user will revoke all the SSH keys associated with that particular user. It facilitates centralized and automated SSH key pair management which is useful in handling cases like response to compromised SSH key pairs and/or revocation of external/third-party/Vendor users.",
            references: [
              "https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys",
            ],
            remediation:
              "From console:<ol><li>Go to the VM compute metadata page by visiting https://console.cloud.google.com/compute/metadata.</li><li>Click <samp>Edit</samp>></li><li>Add a metadata entry where the key is <samp>enable-oslogin</samp> and the value is <samp>TRUE</samp>.</li><li>Click <samp>Save</samp> to apply the changes.</li><li>For every instances that overrides the project setting, go to the <samp>VM Instances</samp> page at https://console.cloud.google.com/compute/instances.</li><li>Click the name of the instance on which you want to remove the metadata value.</li><li>At the top of the instance details page, click <samp>Edit</samp> to edit the instance settings.</li><li>Under <samp>Custom metadata</samp>, remove any entry with key <samp>enable-oslogin</samp> and the value is <samp>FALSE</samp></li><li>At the bottom of the instance details page, click <samp>Save</samp> to apply your changes to the instance.</li></ol>",
            service: "Compute Engine",
          },
          "computeengine-instance-public-ip-adresses": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "4.9",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description: "Instances Have Public IP Addresses",
            flagged_items: 0,
            id_suffix: "public_ip_addresses",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.zones.id.instances.id",
            rationale:
              "To reduce your attack surface, Compute instances should not have public IP addresses. Instead, instances should be configured behind load balancers, to minimize the instance's exposure to the internet.",
            references: [
              "https://cloud.google.com/load-balancing/docs/backend-service#backends_and_external_ip_addresses",
              "https://cloud.google.com/compute/docs/instances/connecting-advanced#sshbetweeninstances",
              "https://cloud.google.com/compute/docs/instances/connecting-to-instance",
              "https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address#unassign_ip",
              "https://cloud.google.com/resource-manager/docs/organization-policy/org-policy-constraints",
            ],
            remediation:
              "From console:<ol><li>Go to the <samp>VM instances</samp> page by visiting https://console.cloud.google.com/compute/instances.</li><li>Click on the instance name to go the <samp>Instance detail</samp> page.</li><li>Click <samp>Edit</samp></li><li>For each Network interface, ensure that <samp>External IP</samp> is set to <samp>None</samp>.</li><li>Click <samp>Done</samp> and then click <samp>Save</samp>.</li></ol>",
            service: "Compute Engine",
          },
          "computeengine-instance-shielded-vm-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "4.8",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Instances",
            description: "Shielded VM Disabled",
            flagged_items: 0,
            id_suffix: "shielded_enable",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.zones.id.instances.id",
            rationale:
              "Shielded VM offers verifiable integrity of your Compute Engine VM instances, so you can be confident your instances haven't been compromised by boot-or kernel-level malware or rootkits. Shielded VM's verifiable integrity is achieved through the use of Secure Boot, virtual trusted platform module (vTPM)-enabled Measured Boot, and integrity monitoring.",
            references: [
              "https://cloud.google.com/compute/docs/instances/modifying-shielded-vm",
              "https://cloud.google.com/shielded-vm",
              "https://cloud.google.com/security/shielded-cloud/shielded-vm#organization-policy-constraint",
            ],
            remediation:
              "From console:<ol><li>Go to the <samp>VM instances</samp> page by visiting https://console.cloud.google.com/compute/instances.</li><li>Click on the instance name to see its <samp>VM Instance detail</samp> page.</li><li>Click <samp>STOP</samp> to stop the instance.<li>When the instance has stopped, click <samp>Edit</samp></li><li>In the Shielded VM section, select <samp>Turn on vTPM</samp> and <samp>Turn on Integrity Monitoring</samp>.</li><li>Optionally, if you do not use any custom or unsigned drivers on the instance, also select <samp>Turn on Secure Boot</samp>.</li><li>Click the <samp>Save</samp> button to modify the instance and then click <samp>START</samp> to restart it.</li></ol>",
            service: "Compute Engine",
          },
          "computeengine-instance-with-deletion-protection-disabled": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Instances",
            description: "Instance without Deletion Protection",
            flagged_items: 0,
            id_suffix: "deletion_protection_enabled",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.zones.id.instances.id",
            rationale:
              "It is good practice to enable this feature on production instances, to ensure that they may not be deleted by accident.",
            references: [
              "https://cloud.google.com/compute/docs/instances/preventing-accidental-vm-deletion",
            ],
            remediation: null,
            service: "Compute Engine",
          },
          "computeengine-loadbalancer-forwarding-rule-forwards-sensitive-port":
            {
              checked_items: 0,
              compliance: null,
              dashboard_name: "Forwarding Rule",
              description:
                "External Load Balancer Rule Forwards a Non-Standard Port",
              flagged_items: 0,
              items: [],
              level: "warning",
              path: "computeengine.projects.id.regions.id.forwarding_rules.id",
              rationale:
                "The Load Balancer rule was found to be forwarding a non-standard port (80 or 443), potentially exposing a sensitive service. If such services need to be exposed, a restriction on the source address could help to reduce the attack surface of the infrastructure.",
              references: null,
              remediation: null,
              service: "Compute Engine",
            },
          "computeengine-loadbalancer-global-forwarding-rule-forwards-sensitive-port":
            {
              checked_items: 0,
              compliance: null,
              dashboard_name: "Forwarding Rule",
              description:
                "External Load Balancer Global Rule Forwards a Non-Standard Port",
              flagged_items: 0,
              items: [],
              level: "warning",
              path: "computeengine.projects.id.global_forwarding_rules.id",
              rationale:
                "The Load Balancer rule was found to be forwarding a non-standard port (80 or 443), potentially exposing a sensitive service. If such services need to be exposed, a restriction on the source address could help to reduce the attack surface of the infrastructure.",
              references: null,
              remediation: null,
              service: "Compute Engine",
            },
          "computeengine-network-default-in-use": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "3.1",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Networks",
            description: "Default Network Should Be Removed",
            flagged_items: 0,
            id_suffix: "name",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.networks.id",
            rationale:
              "The default network has a preconfigured network configuration and automatically generates insecure firewall rules. These automatically created firewall rules do not get audit logged and cannot be configured to enable firewall rule logging.",
            references: [
              "https://cloud.google.com/compute/docs/networking#firewall_rules",
              "https://cloud.google.com/compute/docs/reference/latest/networks/insert",
              "https://cloud.google.com/compute/docs/reference/latest/networks/delete",
              "https://cloud.google.com/vpc/docs/firewall-rules-logging",
              "https://cloud.google.com/vpc/docs/vpc#default-network",
              "https://cloud.google.com/sdk/gcloud/reference/compute/networks/delete",
            ],
            remediation:
              "From  Console:<ol><li>Go to <samp>VPC networks</samp> page by visiting: https://console.cloud.google.com/networking/networks/list</li><li>Click the network named <samp>default</samp></li><li>On the network detail page, click <samp>EDIT</samp></li><li>Click <samp>DELETE VPC NETWORK</samp> </li><li>If needed, create a new network to replace the default network</li></ol>",
            service: "Compute Engine",
          },
          "computeengine-network-legacy-in-use": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "3.2",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Networks",
            description: "Legacy Network Should Be Removed",
            flagged_items: 0,
            id_suffix: "legacy_mode",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.networks.id",
            rationale:
              "Legacy networks have a single network IPv4 prefix range and a single gateway IP address for the whole network. The network is global in scope and spans all cloud regions. Subnetworks cannot be created in a legacy network and are unable to switch from legacy to auto or custom subnet networks. Legacy networks can have an impact for high network traffic projects and are subject to a single point of contention or failure.",
            references: [
              "https://cloud.google.com/vpc/docs/using-legacy#creating_a_legacy_network",
              "https://cloud.google.com/vpc/docs/using-legacy#deleting_a_legacy_network",
            ],
            remediation:
              "For each Google Cloud Platform project,<ol><li>1. Follow the documentation and create a non-legacy network suitable for the organization's requirements.</li><li>Follow the documentation and delete the networks in the <samp>legacy</samp> mode.</li></ol>",
            service: "Compute Engine",
          },
          "computeengine-network-with-no-instances": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Networks",
            description: "Network without Instances",
            flagged_items: 0,
            items: [],
            level: "warning",
            path: "computeengine.projects.id.networks.id",
            rationale:
              "Maintaining unused resources increases risks of misconfigurations and increases the difficulty of audits.",
            references: null,
            remediation: null,
            service: "Compute Engine",
          },
          "computeengine-old-disk-snapshot": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Snapshots",
            description: "Old Instance Disk Snapshot",
            flagged_items: 0,
            items: [],
            level: "warning",
            path: "computeengine.projects.id.snapshots.id",
            rationale:
              "Disk snapshots that are over 90 days are likely to be outdated.",
            references: [
              "https://cloud.google.com/compute/docs/disks/create-snapshots",
              "https://cloud.google.com/compute/docs/disks/scheduled-snapshots",
              "https://cloud.google.com/compute/docs/disks/snapshot-best-practices",
            ],
            remediation: null,
            service: "Compute Engine",
          },
          "computeengine-vpc-flow-logs-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "3.8",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Subnetwork",
            description: "VPC Flow Logs Not Enabled",
            flagged_items: 0,
            id_suffix: "flowlogs_enabled",
            items: [],
            level: "warning",
            path: "computeengine.projects.id.regions.id.subnetworks.id",
            rationale:
              "VPC Flow Logs were not enabled for this subnet. It is best practice to enable Flow Logs to some degree in order to have network visibility in the event of resource compromise, as well as source data for threat detections.",
            references: [
              "https://cloud.google.com/vpc/docs/using-flow-logs#enabling_vpc_flow_logging",
            ],
            remediation: null,
            service: "Compute Engine",
          },
        },
        firewalls_count: 0,
        global_forwarding_rules_count: 0,
        instances_count: 0,
        networks_count: 0,
        projects: {
          "cordova-358e9": {
            firewalls: {},
            firewalls_count: 0,
            global_forwarding_rules: {},
            global_forwarding_rules_count: 0,
            networks: {},
            networks_count: 0,
            regions: {},
            regions_count: 0,
            snapshots: {},
            snapshots_count: 0,
            zones: {},
            zones_count: 0,
          },
        },
        snapshots_count: 0,
        subnetworks_count: 0,
      },
      dns: {
        filters: {},
        findings: {
          "dns-zones-dnssec-not-enabled": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Cloud DNS",
            description: "DNSSEC Is Not Enabled for Cloud DNS",
            flagged_items: 0,
            id_suffix: "dnssec_enabled",
            items: [],
            level: "warning",
            path: "dns.projects.id.managed_zones.id",
            rationale:
              "Domain Name System Security Extensions (DNSSEC) adds security to the DNS protocol by enabling DNS responses to be validated. Having a trustworthy DNS that translates a domain name like www.example.com into its associated IP address is an increasingly important building block of today’s web-based applications. Attackers can hijack this process of domain/IP lookup and redirect users to a malicious site through DNS hijacking and man-in-the-middle attacks. DNSSEC helps mitigate the risk of such attacks by cryptographically signing DNS records. As a result, it prevents attackers from issuing fake DNS responses that may misdirect browsers to nefarious websites.",
            references: [
              "https://cloudplatform.googleblog.com/2017/11/DNSSEC-now-available-in-Cloud-DNS.html",
              "https://cloud.google.com/dns/dnssec-config#enabling",
              "https://cloud.google.com/dns/dnssec",
            ],
            remediation:
              "From Console:<ol><li>Go to Cloud DNS by visiting https://console.cloud.google.com/net-services/dns/zones.</li><li>For each zone of <samp>Type Public</samp>, set <samp>DNSSEC</samp> to <samp>ON</samp>.</li></ol>",
            service: "DNS",
          },
          "dns-zones-key-signing-key-using-rsasha1": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Cloud DNS",
            description: "DNSSEC Key-signing Key Uses RSASHA1",
            flagged_items: 0,
            items: [],
            level: "warning",
            path: "dns.projects.id.managed_zones.id",
            rationale:
              "The algorithm used for key signing should be a recommended one and it should be strong. When enabling DNSSEC for a managed zone, or creating a managed zone with DNSSEC, the user can select the DNSSEC signing algorithms and the denial-of-existence type. Changing the DNSSEC settings is only effective for a managed zone if DNSSEC is not already enabled. If there is a need to change the settings for a managed zone where it has been enabled, turn DNSSEC off and then re-enable it with different settings.",
            references: [
              "https://cloud.google.com/dns/dnssec-advanced#advanced_signing_options",
            ],
            remediation:
              "From Console:<ol><li>If it is necessary to change the settings for a managed zone where it has been enabled, NSSEC must be turned off and re-enabled with different settings. To turn off DNSSEC, run the following command:<br><code>gcloud dns managed-zones update ZONE_NAME --dnssec-state off</code></br></li><li>To update key-signing for a reported managed DNS Zone, run the following command:<br><code> gcloud dns managed-zones update ZONE_NAME --dnssec-state on --ksk-algorithm KSK_ALGORITHM --ksk-key-length KSK_KEY_LENGTH --zsk-algorithm ZSK_ALGORITHM --zsk-key-length ZSK_KEY_LENGTH --denial-of-existence DENIAL_OF_EXISTENCE</code></br></li></ol>",
            service: "DNS",
          },
          "dns-zones-zone-signing-key-using-rsasha1": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Cloud DNS",
            description: "DNSSEC Zone-signing Key Uses RSASHA1",
            flagged_items: 0,
            items: [],
            level: "warning",
            path: "dns.projects.id.managed_zones.id",
            rationale:
              "The algorithm used for key signing should be a recommended one and it should be strong. When enabling DNSSEC for a managed zone, or creating a managed zone with DNSSEC, the user can select the DNSSEC signing algorithms and the denial-of-existence type. Changing the DNSSEC settings is only effective for a managed zone if DNSSEC is not already enabled. If there is a need to change the settings for a managed zone where it has been enabled, turn DNSSEC off and then re-enable it with different settings.",
            references: [
              "https://cloud.google.com/dns/dnssec-advanced#advanced_signing_options",
            ],
            remediation:
              "From Console:<ol><li>If it is necessary to change the settings for a managed zone where it has been enabled, NSSEC must be turned off and re-enabled with different settings. To turn off DNSSEC, run the following command:<br><code>gcloud dns managed-zones update ZONE_NAME --dnssec-state off</code></br></li><li>To update key-signing for a reported managed DNS Zone, run the following command:<br><code> gcloud dns managed-zones update ZONE_NAME --dnssec-state on --ksk-algorithm KSK_ALGORITHM --ksk-key-length KSK_KEY_LENGTH --zsk-algorithm ZSK_ALGORITHM --zsk-key-length ZSK_KEY_LENGTH --denial-of-existence DENIAL_OF_EXISTENCE</code></br></li></ol>",
            service: "DNS",
          },
        },
        managed_zones_count: 0,
        projects: {
          "cordova-358e9": {
            managed_zones: {},
            managed_zones_count: 0,
          },
        },
      },
      functions: {
        filters: {},
        findings: {
          "functions-v1-allowing-http": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Functions",
            description: "Functions Allowing HTTP Traffic (Gen 1)",
            flagged_items: 0,
            id_suffix: "security_level",
            items: [],
            level: "warning",
            path: "functions.projects.id.functions_v1.id",
            rationale:
              "Use of a secure protocol (HTTPS) is best practice for encrypted communication. A function allowing HTTP traffic can be vulnerable to eavesdropping and man-in-the-middle attacks.",
            references: [
              "https://cloud.google.com/logging/docs/reference/audit/appengine/rest/Shared.Types/SecurityLevel",
            ],
            remediation: null,
            service: "Cloud Functions",
          },
          "functions-v1-environment-variables-secrets": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Functions",
            description:
              "Potential Secrets in Function Environment Variables (Gen 1)",
            flagged_items: 0,
            id_suffix: "environment_variables_secrets",
            items: [],
            level: "warning",
            path: "functions.projects.id.functions_v1.id",
            rationale:
              "Anyone who can access the function can view the configured secrets. Best practice is to store configuration secrets in Secret Manager (or similar).",
            references: null,
            remediation: null,
            service: "Cloud Functions",
          },
          "functions-v1-function-allAuthenticatedUsers": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Functions",
            description: 'Functions Accessible by "allAuthenticatedUsers"',
            flagged_items: 0,
            id_suffix: "bindings",
            items: [],
            level: "danger",
            path: "functions.projects.id.functions_v1.id",
            rationale:
              "Allowing anonymous and/or public access grants permissions to anyone to access the function's configuration and content. This configuration should be restricted to follow the principle of least privilege",
            references: [
              "https://cloud.google.com/logging/docs/reference/audit/appengine/rest/Shared.Types/SecurityLevel",
            ],
            remediation: null,
            service: "Cloud Functions",
          },
          "functions-v1-function-allUsers": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Functions",
            description: 'Functions Accessible by "allUsers"',
            flagged_items: 0,
            id_suffix: "bindings",
            items: [],
            level: "danger",
            path: "functions.projects.id.functions_v1.id",
            rationale:
              "Allowing anonymous and/or public access grants permissions to anyone to access the function's configuration and content. This configuration should be restricted to follow the principle of least privilege",
            references: [
              "https://cloud.google.com/logging/docs/reference/audit/appengine/rest/Shared.Types/SecurityLevel",
            ],
            remediation: null,
            service: "Cloud Functions",
          },
          "functions-v1-public-endpoint": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Functions",
            description: "Public Function Endpoint (Gen 1)",
            display_path: "functions.projects.id.functions_v1.id",
            flagged_items: 0,
            id_suffix: "ingress_settings",
            items: [],
            level: "warning",
            path: "functions.projects.id.functions_v1.id.bindings.id",
            rationale:
              "The Cloud Function's ingress configuration allowed all traffic, potentially exposing undesired functionality. It is recommended that traffic reaching functions be routed via a load balancer, to minimize the attack surface.",
            references: null,
            remediation: null,
            service: "Cloud Functions",
          },
          "functions-v2-environment-variables-secrets": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Functions",
            description:
              "Potential Secrets in Function Environment Variables (Gen 2)",
            flagged_items: 0,
            id_suffix: "environment_variables_secrets",
            items: [],
            level: "warning",
            path: "functions.projects.id.functions_v2.id",
            rationale:
              "Anyone who can access the function can view the configured secrets. Best practice is to store configuration secrets in Secret Manager (or similar).",
            references: null,
            remediation: null,
            service: "Cloud Functions",
          },
          "functions-v2-public-endpoint": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Functions",
            description: "Public Function Endpoint (Gen 2)",
            flagged_items: 0,
            id_suffix: "ingress_settings",
            items: [],
            level: "warning",
            path: "functions.projects.id.functions_v2.id",
            rationale:
              "The Cloud Function's ingress configuration allowed all traffic, potentially exposing undesired functionality. It is recommended that traffic reaching functions be routed via a load balancer, to minimize the attack surface.",
            references: null,
            remediation: null,
            service: "Cloud Functions",
          },
        },
        functions_v1_count: 0,
        functions_v2_count: 0,
        projects: {
          "cordova-358e9": {
            functions_v1: {},
            functions_v1_count: 0,
            functions_v2: {},
            functions_v2_count: 0,
          },
        },
      },
      iam: {
        bindings_count: 0,
        bindings_separation_duties_count: 1,
        domains_count: 0,
        filters: {},
        findings: {
          "iam-gmail-accounts-used": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.1",
                version: "1.0.0",
              },
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.1",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Users",
            description: "Gmail Account in Use",
            flagged_items: 0,
            id_suffix: "name",
            items: [],
            level: "warning",
            path: "iam.projects.id.users.id",
            rationale:
              "It is recommended fully-managed corporate Google accounts be used for increased visibility, auditing, and controlling access to Cloud Platform resources. Email accounts based outside of the user's organization, such as personal accounts, should not be used for business purposes.",
            references: [
              "https://cloud.google.com/docs/enterprise/best-practices-for-enterprise-organizations#manage-identities",
              "https://support.google.com/work/android/answer/6371476",
              "https://cloud.google.com/sdk/gcloud/reference/organizations/get-iam-policy",
              "https://cloud.google.com/sdk/gcloud/reference/beta/resource-manager/folders/get-iam-policy",
              "https://cloud.google.com/sdk/gcloud/reference/projects/get-iam-policy",
              "https://cloud.google.com/resource-manager/docs/organization-policy/org-policy-constraints",
              "https://cloud.google.com/resource-manager/docs/organization-policy/restricting-domains",
            ],
            remediation: null,
            service: "IAM",
          },
          "iam-lack-of-service-account-key-rotation": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.6",
                version: "1.0.0",
              },
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.7",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Service Accounts",
            description: "Lack of User-Managed Service Account Key Rotation",
            display_path: "iam.projects.id.service_accounts.id",
            flagged_items: 0,
            id_suffix: "valid_after",
            items: [],
            level: "warning",
            path: "iam.projects.id.service_accounts.id.keys.id",
            rationale:
              "Rotating Service Account keys will reduce the window of opportunity for an access key that is associated with a compromised or terminated account to be used. User-managed Service Account keys should be rotated to ensure that data cannot be accessed with an old key which might have been lost, cracked, or stolen. It should be ensured that keys are rotated every 90 days.<br>This issue does not apply to system-managed keys, as they are automatically rotated by Google, and are used for signing for a maximum of two weeks. The rotation process is probabilistic, and usage of the new key will gradually ramp up and down over the key's lifetime.",
            references: [
              "https://cloud.google.com/iam/docs/understanding-service-accounts#managing_service_account_keys",
              "https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts/keys/list",
              "https://cloud.google.com/iam/docs/service-accounts",
              "https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts.keys",
            ],
            remediation:
              "From console: <br>Delete any external (user-managed) Service Account Key older than 90 days: <ol><li>Go to <samp>APIs & Services\\Credentials</samp> using <samp>https://console.cloud.google.com/apis/credentials</samp></li><li>In the Section <samp>Service Account Keys</samp>, for every external (user-managed) service account key where <samp>creation date</samp> is greater than or equal to the past 90 days, click <samp>Delete Bin Icon</samp> to <samp>Delete Service Account key</samp></li></ol> <br>Create a new external (user-managed) Service Account Key for a Service Account:<ol><li>Go to <samp>APIs & Services\\Credentials</samp> using <samp>https://console.cloud.google.com/apis/credentials</samp></li><li>Click <samp>Create Credentials</samp> and <samp>Select Service Account Key.</samp></li><li>Choose the service account in the drop-down list for which an External (user-managed) Service Account key needs to be created.</li><li>Select the desired key type format among <samp>JSON</samp> or <samp>P12</samp>.</li><li>Click <samp>Create</samp>. It will download the <samp>private key</samp>. Keep it safe.</li><li>Click <samp>close</samp> if prompted</li><li>The site will redirect to the <samp>APIs & Services\\Credentials</samp> page. Make a note of the new <samp>ID</samp> displayed in the <samp>Service account keys</samp> section.</li></ol> ",
            service: "IAM",
          },
          "iam-primitive-role-in-use": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.4",
                version: "1.0.0",
              },
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.5",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Bindings",
            description: "Basic Role in Use",
            flagged_items: 0,
            id_suffix: "name",
            items: [],
            level: "warning",
            path: "iam.projects.id.bindings.id",
            rationale:
              "Basic roles grant significant privileges. In most cases, usage of these roles is not recommended and does not follow security best practice.<br><br><b>Note: </b>This rule may flag Google-Managed Service Accounts. Google services rely on these Service Accounts having access to the project, and recommends not removing or changing the Service Account's role (see https://cloud.google.com/iam/docs/service-accounts#google-managed).",
            references: [
              "https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts/",
              "https://cloud.google.com/iam/docs/understanding-roles",
              "https://cloud.google.com/iam/docs/understanding-service-accounts",
            ],
            remediation:
              "From Console: <ol><li>Go to <samp>IAM & admin/IAM</samp> using <samp>https://console.cloud.google.com/iam-admin/iam</samp></li><li>Got to the <samp>Members</samp></li><li>Identify <samp>User-Managed user created</samp> service account with roles containing <samp>*Admin</samp> or <samp>*admin</samp> or role matching <samp>Editor</samp> or role matching <samp>Owner</samp></li><li>Click the <samp>Delete bin</samp> icon to remove the role from the member (service account in this case)</li></ol>",
            service: "IAM",
          },
          "iam-role-account-separation-duties-is-false": {
            checked_items: 1,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.8",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Project",
            description:
              "Separation of Duties Not Enforced for Service Account",
            flagged_items: 0,
            id_suffix: "account_separation_duties",
            items: [],
            level: "warning",
            path: "iam.projects.id.bindings_separation_duties.id",
            rationale:
              "Separation of duties is the concept of ensuring that one individual does not have all necessary permissions to be able to complete a malicious action. In Cloud IAM-service accounts, this could be an action such as using a service account to access resources that user should not normally have access to. No user should have Service Account Admin and Service Account User roles assigned at the same time.",
            references: [
              "https://cloud.google.com/iam/docs/service-accounts",
              "https://cloud.google.com/iam/docs/understanding-roles",
              "https://cloud.google.com/iam/docs/granting-changing-revoking-access",
            ],
            remediation:
              "From console:<ol><li>Go to <samp>IAM & Admin/IAM</samp> using <samp>https://console.cloud.google.com/iam-admin/iam</samp>.</li><li>For any member having both <samp>Service Account Admin</samp> and <samp>Service account User</samp> roles granted/assigned, click the <samp>Delete Bin</samp> icon to remove either role from the member.<br> Removal of a role should be done based on the business requirements.</li></ol>",
            service: "IAM",
          },
          "iam-role-assigned-to-domain": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Bindings",
            description: "IAM Role Assigned to Domain",
            flagged_items: 0,
            id_suffix: "domains",
            items: [],
            level: "danger",
            path: "iam.projects.id.bindings.id",
            rationale:
              "Roles granted to Workspace domains grant permissions to all users of the domain's Organization, which goes against the principle of least privilege.",
            references: [
              "https://cloud.google.com/iam/docs/understanding-roles",
              "https://cloud.google.com/iam/docs/using-iam-securely",
            ],
            remediation: null,
            service: "IAM",
          },
          "iam-role-assigned-to-user": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Bindings",
            description: "IAM Role Assigned to User",
            flagged_items: 0,
            id_suffix: "users",
            items: [],
            level: "warning",
            path: "iam.projects.id.bindings.id",
            rationale:
              "Best practices recommends granting roles to a Google Suite group instead of to individual users when possible. It is easier to add members to and remove members from a group instead of updating a Cloud IAM policy to add or remove users.",
            references: [
              "https://cloud.google.com/iam/docs/understanding-roles",
              "https://cloud.google.com/iam/docs/using-iam-securely",
            ],
            remediation: null,
            service: "IAM",
          },
          "iam-role-kms-separation-duties-is-false": {
            checked_items: 1,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.11",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Project",
            description: "Separation of Duties Not Enforced for KMS",
            flagged_items: 0,
            id_suffix: "kms_separation_duties",
            items: [],
            level: "warning",
            path: "iam.projects.id.bindings_separation_duties.id",
            rationale:
              "Separation of duties is the concept of ensuring that one individual does not have all necessary permissions to be able to complete a malicious action. In Cloud KMS, this could be an action such as using a key to access and decrypt data a user should not normally have access to. Separation of duties is a business control typically used in larger organizations, meant to help avoid security or privacy incidents and errors. It is considered best practice. No user(s) should have Cloud KMS Admin and any of the Cloud KMS CryptoKey Encrypter/Decrypter, Cloud KMS CryptoKey Encrypter, Cloud KMS CryptoKey Decrypter roles assigned at the same time.",
            references: [
              "https://cloud.google.com/kms/docs/separation-of-duties",
            ],
            remediation:
              "From console:<ol><li>Go to <samp>IAM & Admin/IAM</samp> using <samp>https://console.cloud.google.com/iam-admin/iam</samp>.</li><li>For any member having <samp>Cloud KMS Admin</samp> and any of the <samp>Cloud KMS CryptoKey Encrypter/Decrypter, Cloud KMS CryptoKey Encrypter, Cloud KMS CryptoKey Decrypter</samp> roles granted/assigned, click the <samp>Delete Bin</samp> icon to remove either role from the member.<br> Removal of a role should be done based on the business requirements.</li></ol>",
            service: "IAM",
          },
          "iam-sa-has-admin-privileges": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.4",
                version: "1.0.0",
              },
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.5",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Bindings",
            description: "Service Account with Admin Privileges",
            flagged_items: 0,
            id_suffix: "service_accounts",
            items: [],
            level: "warning",
            path: "iam.projects.id.bindings.id",
            rationale:
              "Service accounts represent service-level security of the Resources (application or a VM) which can be determined by the roles assigned to it. Enrolling Service Accounts with administrative privileges grants full access to assigned application or a VM, Service Account Access holder can user.<br><br><b>Note: </b>This rule may flag Google-Managed Service Accounts. Google services rely on these Service Accounts having access to the project, and recommends not removing or changing the Service Account's role",
            references: [
              "https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts/",
              "https://cloud.google.com/iam/docs/understanding-roles",
              "https://cloud.google.com/iam/docs/understanding-service-accounts",
            ],
            remediation:
              "From Console: <ol><li>Go to <samp>IAM & admin/IAM</samp> using <samp>https://console.cloud.google.com/iam-admin/iam</samp></li><li>Got to the <samp>Members</samp></li><li>Identify <samp>User-Managed user created</samp> service account with roles containing <samp>*Admin</samp> or <samp>*admin</samp> or role matching <samp>Editor</samp> or role matching <samp>Owner</samp></li><li>Click the <samp>Delete bin</samp> icon to remove the role from the member (service account in this case)</li></ol>",
            service: "IAM",
          },
          "iam-service-account-user-allAuthenticatedUsers": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Service Accounts",
            description:
              "Service Account with 'allAuthenticatedUsers' Service Account User",
            display_path: "iam.projects.id.service_accounts.id",
            flagged_items: 0,
            items: [],
            level: "warning",
            path: "iam.projects.id.service_accounts.id.bindings.id",
            rationale:
              "Access to the Service Account User role (roles/iam.serviceAccountUser) should be restricted, as members granted this role on a service account can use it to indirectly access all the resources to which the service account has access. ",
            references: [
              "https://cloud.google.com/iam/docs/service-accounts#user-role",
            ],
            remediation: null,
            service: "IAM",
          },
          "iam-service-account-user-allUsers": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Service Accounts",
            description: "Service Account with 'allUsers' Service Account User",
            display_path: "iam.projects.id.service_accounts.id",
            flagged_items: 0,
            items: [],
            level: "warning",
            path: "iam.projects.id.service_accounts.id.bindings.id",
            rationale:
              "Access to the Service Account User role (roles/iam.serviceAccountUser) should be restricted, as members granted this role on a service account can use it to indirectly access all the resources to which the service account has access. ",
            references: [
              "https://cloud.google.com/iam/docs/service-accounts#user-role",
            ],
            remediation: null,
            service: "IAM",
          },
          "iam-service-account-with-user-managed-keys": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.3",
                version: "1.0.0",
              },
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.4",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Service Accounts",
            description: "User-Managed Service Account Keys",
            display_path: "iam.projects.id.service_accounts.id",
            flagged_items: 0,
            id_suffix: "key_type",
            items: [],
            level: "warning",
            path: "iam.projects.id.service_accounts.id.keys.id",
            rationale:
              "It is recommended to prevent use of user-managed service account keys, as anyone who has access to the keys will be able to access resources through the service account. Best practice recommends using GCP-managed keys, which are used by Cloud Platform services such as App Engine and Compute Engine. These keys cannot be downloaded. Google will keep the keys and automatically rotate them on an approximately weekly basis.",
            references: [
              "https://cloud.google.com/iam/docs/understanding-service-accounts#managing_service_account_keys",
              "https://cloud.google.com/resource-manager/docs/organization-policy/restricting-service-accounts",
            ],
            remediation:
              "From Console: <ol><li>Go to the IAM page in the GCP Console using <samp>https://console.cloud.google.com/iam-admin/iam</samp></li><li>In the left navigation pane, click <samp>Service accounts</samp>. All service accounts and their corresponding keys are listed.</li><li>Click the service account.</li><li>Click the <samp>edit</samp> and delete the keys.</li></ol>",
            service: "IAM",
          },
          "iam-user-has-sa-user-role": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.5",
                version: "1.0.0",
              },
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.6",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Bindings",
            description:
              "User with Privileged Service Account Roles at the Project Level",
            flagged_items: 0,
            id_suffix: "user_has_sa_user_role",
            items: [],
            level: "warning",
            path: "iam.projects.id.bindings.id",
            rationale:
              "Granting the iam.serviceAccountUser, iam.serviceAccountTokenCreator, or iam.serviceAccountActor role to a user for a project gives the user access to all service accounts in the project, including service accounts that may be created in the future. This can result into elevation of privileges by using service accounts and corresponding Compute Engine instances.",
            references: [
              "https://cloud.google.com/iam/docs/service-accounts",
              "https://cloud.google.com/iam/docs/granting-changing-revoking-access",
              "https://cloud.google.com/iam/docs/understanding-roles",
              "https://cloud.google.com/iam/docs/granting-changing-revoking-access",
              "https://console.cloud.google.com/iam-admin/iam",
            ],
            remediation:
              "From console: <ol><li>Go to the IAM page in the GCP Console by visiting: https://console.cloud.google.com/iam-admin/iam.</li><li>Click on the filter table text bar. Type <samp>Role: Service Account User</samp></li><li>Click the <samp>Delete Bin<samp> icon in front of the role <samp>Service Account User</samp> for every user listed as a result of a filter.</li><li>Click on the filter table text bar. Type <samp>Role: Service Account Token Creator<samp></li><li>Click the <samp>Delete Bin</samp> icon in front of the role <samp>Service Account Token Creator</samp> for every user listed as a result of a filter.</li></ol>",
            service: "IAM",
          },
        },
        groups_count: 0,
        projects: {
          "cordova-358e9": {
            bindings: {},
            bindings_count: 0,
            bindings_separation_duties: {
              "cordova-358e9": {
                account_separation_duties: true,
                id: "cordova-358e9",
                kms_separation_duties: true,
                name: "cordova-358e9",
              },
            },
            bindings_separation_duties_count: 1,
            domains: {},
            domains_count: 0,
            groups: {},
            groups_count: 0,
            service_accounts: {},
            service_accounts_count: 0,
            users: {},
            users_count: 0,
          },
        },
        service_accounts_count: 0,
        users_count: 0,
      },
      kms: {
        filters: {},
        findings: {
          "kms-cryptokeys-anonymously-publicly-accessible": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.9",
                version: "1.1.0",
              },
            ],
            dashboard_name: "KMS Bindings",
            description:
              "Cloud KMS Cryptokeys Anonymously or Publicly Accessible",
            display_path: "kms.projects.id.keyrings.id",
            flagged_items: 0,
            id_suffix: "anonymous_public_accessible",
            items: [],
            level: "danger",
            path: "kms.projects.id.keyrings.id.keys.id.kms_iam_policy.id",
            rationale:
              "Granting permissions to allUsers or allAuthenticatedUsers allows anyone to access the data set. Such access might not be desirable if sensitive data is stored at the location. In this case, ensure that anonymous and/or public access to a Cloud KMS cryptokey is not allowed.",
            references: [
              "https://cloud.google.com/sdk/gcloud/reference/kms/keys/remove-iam-policy-binding",
              "https://cloud.google.com/sdk/gcloud/reference/kms/keys/set-iam-policy",
              "https://cloud.google.com/sdk/gcloud/reference/kms/keys/get-iam-policy",
              "https://cloud.google.com/kms/docs/resource-hierarchy#key_resource_id",
            ],
            remediation:
              "From command line:<ol><li>List all Cloud KMS <samp>Cryptokeys</samp>: <br> gcloud kms keys list --keyring=[key_ring_name] --location=global --format=json | jq '.[].name'</li><li>Remove IAM policy binding for a KMS key to remove access to <samp>allUsers</samp> and <samp>allAuthenticatedUsers</samp> using the below command.<br> gcloud kms keys remove-iam-policy-binding [key_name] --keyring=[key_ring_name] --location=global --member='allAuthenticatedUsers' --role='[role]' <br> gcloud kms keys remove-iam-policy-binding [key_name] --keyring=[key_ring_name] --location=global --member='allUsers' --role='[role]'</li></ol>",
            service: "KMS",
          },
          "kms-encryption-keys-not-rotated": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "1.10",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Keys",
            description: "KMS Encryption Not Rotated within 90 Days",
            display_path: "kms.projects.id.keyrings.id",
            flagged_items: 0,
            id_suffix: "rotation_period",
            items: [],
            level: "warning",
            path: "kms.projects.id.keyrings.id.keys.id",
            rationale:
              "Set a key rotation period and starting time. A key can be created with a specified rotation period, which is the time between when new key versions are generated automatically. A key is used to protect some corpus of data. A collection of files could be encrypted with the same key and people with decrypt permissions on that key would be able to decrypt those files. Therefore, it's necessary to make sure the rotation period is set to a specific time.",
            references: [
              "https://cloud.google.com/kms/docs/key-rotation#frequency_of_key_rotation",
              "https://cloud.google.com/kms/docs/re-encrypt-data",
            ],
            remediation:
              "From console:<ol><li>Got to <samp>Cryptographic Keys</samp> by visiting: https://console.cloud.google.com/security/kms.</li><li>Click on the specific key ring</li><li>From the list of keys, choose the specific key and Click on <samp>Right side pop up the blade (3 dots).</samp></li><li>Click on <samp>Edit rotation period.</samp></li><li>On the pop-up window, <samp>Select a new rotation period</samp> in days which should be less than 90 and then choose <samp>Starting on</samp> date (date from which the rotation period begins).</li></ol>",
            service: "KMS",
          },
        },
        keyrings_count: 0,
        projects: {
          "cordova-358e9": {
            keyrings: {},
            keyrings_count: 0,
          },
        },
      },
      kubernetesengine: {
        clusters_count: 0,
        filters: {},
        findings: {
          "kubernetesengine-basic-authentication-enabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.10",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.8.1",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Basic Authentication Enabled",
            flagged_items: 0,
            id_suffix: "basic_authentication_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "Basic authentication allows a user to authenticate to the cluster with a username and password and it is stored in plain text without any encryption. Disabling Basic authentication will prevent attacks like brute force. Its recommended to use either client certificate or IAM for authentication.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#restrict_authn_methods",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#evaluation_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-certificate-authentication-enabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS GKE Benchmark",
                reference: "6.8.2",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Certificate Authentication Enabled",
            flagged_items: 0,
            id_suffix: "client_certificate_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "Unless applications use the client certificate authentication method, it should be disabled.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#restrict_authn_methods",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#evaluation_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-alias-ip-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.13",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.6.2",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Alias IP Disabled",
            flagged_items: 0,
            id_suffix: "alias_ip_disabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "With Alias IPs ranges enabled, Kubernetes Engine clusters can allocate IP addresses from a CIDR block known to Google Cloud Platform. This makes your cluster more scalable and allows your cluster to better interact with other GCP products and entities.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#restrict_network_access_to_the_control_plane_and_nodes",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-application-layer-encryption-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS GKE Benchmark",
                reference: "6.3.1",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Application-Layer Secrets Encryption Disabled",
            flagged_items: 0,
            id_suffix: "application_layer_encryption_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "By default, GKE encrypts customer content stored at rest, including Secrets. GKE handles and manages this default encryption without any additional action.<br>Application-layer Secrets Encryption provides an additional layer of security for sensitive data, such as user defined Secrets and Secrets required for the operation of the cluster, such as service account keys, which are all stored in etcd.<br>Using this functionality, you can use a key, that you manage in Cloud KMS, to encrypt data at the application layer. This protects against attackers in the event that they manage to gain access to etcd.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/encrypting-secrets",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-binary-authorization-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS GKE Benchmark",
                reference: "6.10.5",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Binary Authorization Disabled",
            flagged_items: 0,
            id_suffix: "binary_authorization_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "Binary Authorization provides software supply-chain security for images that you deploy to GKE from Google Container Registry (GCR) or another container image registry.<br>Binary Authorization requires images to be signed by trusted authorities during the development process. These signatures are then validated at deployment time. By enforcing validation, you can gain tighter control over your container environment by ensuring only verified images are integrated into the build-and-release process.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/binary-authorization/",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-has-no-labels": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.5",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Clusters Lacking Labels",
            flagged_items: 0,
            id_suffix: "has_no_labels",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "Labels enable users to map their own organizational structures onto system objects in a loosely coupled fashion, without requiring clients to store these mappings. Labels can also be used to apply specific security settings and auto configure objects at creation.",
            references: [
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#use_namespaces_and_rbac_to_restrict_access_to_cluster_resources",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-logging-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.1",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.7.1",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Cluster Logging Disabled",
            flagged_items: 0,
            id_suffix: "logging_disabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "You should enable cluster logging and use a logging service so your cluster can export logs about its activities.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://kubernetes.io/docs/tasks/debug-application-cluster/audit/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#stackdriver_logging",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-master-authorized-networks-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.4",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.6.3",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Master Authorized Networks Disabled",
            flagged_items: 0,
            id_suffix: "master_authorized_networks_disabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "Master authorized networks blocks untrusted IP addresses from outside Google Cloud Platform. Addresses from inside GCP can still reach your master through HTTPS provided that they have the necessary Kubernetes credentials.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/authorized-networks",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#restrict_network_access_to_the_control_plane_and_nodes",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-metadata-server-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS GKE Benchmark",
                reference: "6.4.2",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "GKE Metadata Server Disabled",
            flagged_items: 0,
            id_suffix: "metadata_server_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "Every GKE node stores its metadata on a metadata server. Some of this metadata, such as kubelet credentials and the VM instance identity token, is sensitive and should not be exposed to a Kubernetes workload.<br>Enabling the GKE Metadata server prevents pods (that are not running on the host network) from accessing this metadata and facilitates Workload Identity.<br>When unspecified, the default setting allows running pods to have full access to the node's underlying metadata server.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/protecting-cluster-metadata#concealment",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-monitoring-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.2",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.7.1",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Cluster Monitoring Disabled",
            flagged_items: 0,
            id_suffix: "monitoring_disabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "You should enable cluster monitoring and use a monitoring service so your cluster can export metrics about its activities.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#stackdriver_logging",
              "https://cloud.google.com/monitoring/kubernetes-engine#about-skm",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-network-policy-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.11",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.6.7",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Network Policy Disabled",
            flagged_items: 0,
            id_suffix: "network_policy_disabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "By default, pods are non-isolated; they accept traffic from any source. Pods become isolated by having a NetworkPolicy that selects them. Once there is any NetworkPolicy in a namespace selecting a particular pod, that pod will reject any connections that are not allowed by any NetworkPolicy.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#restrict_with_network_policy",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/security-overview#network_security",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-pod-security-policy-config-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.14",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.10.3",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Pod Security Policy Disabled",
            flagged_items: 0,
            id_suffix: "pod_security_policy_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "A Pod Security Policy is a cluster-level resource that controls security sensitive aspects of the pod specification. The PodSecurityPolicy objects define a set of conditions that a pod must run with in order to be accepted into the system, as well as defaults for the related fields.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/pod-security-policies",
              "https://kubernetes.io/docs/concepts/policy/pod-security-policy",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
            ],
            remediation:
              "Enable the Pod Security Policy. By default, Pod Security Policy is disabled when you create a new cluster.",
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-private-endpoint-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.15",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.6.4",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Private Cluster Endpoint Disabled",
            flagged_items: 0,
            id_suffix: "private_endpoint_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "In a private cluster, the master node has two endpoints, a private and public endpoint. The private endpoint is the internal IP address of the master, behind an internal load balancer in the master's VPC network. Nodes communicate with the master using the private endpoint. The public endpoint enables the Kubernetes API to be accessed from outside the master's VPC network.<br>Although Kubernetes API requires an authorized token to perform sensitive actions, a vulnerability could potentially expose the Kubernetes publicly with unrestricted access. Additionally, an attacker may be able to identify the current cluster and Kubernetes API version and determine whether it is vulnerable to an attack.<br>Unless required, disabling public endpoint will help prevent such threats, and require the attacker to be on the master's VPC network to perform any attack on the Kubernetes API.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#restrict_network_access_to_the_control_plane_and_nodes",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/private-clusters",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-private-google-access-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.16",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Private Google Access Disabled",
            flagged_items: 0,
            id_suffix: "private_ip_google_access_disabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "Enabling Private Google Access allows hosts on a subnetwork to use a private IP address to reach Google APIs rather than an external IP address.",
            references: [
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#restrict_network_access_to_the_control_plane_and_nodes",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-release-channel": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS GKE Benchmark",
                reference: "6.5.4",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Cluster Not Subscribed to Release Channel",
            flagged_items: 0,
            id_suffix: "release_channel",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "Release Channels signal a graduating level of stability and production-readiness. These are based on observed performance of GKE clusters running that version and represent experience and confidence in the cluster version.<br>The Regular release channel upgrades every few weeks and is for production users who need features not yet offered in the Stable channel. These versions have passed internal validation, but don't have enough historical data to guarantee their stability. Known issues generally have known workarounds.<br>The Stable release channel upgrades every few months and is for production users who need stability above all else, and for whom frequent upgrades are too risky. These versions have passed internal validation and have been shown to be stable and reliable in production, based on the observed performance of those clusters.<br>Critical security patches are delivered to all release channels.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/release-channels",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-shielded-nodes-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS GKE Benchmark",
                reference: "6.5.5",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Shielded GKE Nodes Disabled",
            flagged_items: 0,
            id_suffix: "shielded_nodes_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "Shielded GKE nodes protects clusters against boot- or kernel-level malware or rootkits which persist beyond infected OS.<br>Shielded GKE nodes run firmware which is signed and verified using Google's Certificate Authority, ensuring that the nodes' firmware is unmodified and establishing the root of trust for Secure Boot. GKE node identity is strongly protected via virtual Trusted Platform Module (vTPM) and verified remotely by the master node before the node joins the cluster.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/shielded-gke-nodes",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-cluster-workload-identity-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS GKE Benchmark",
                reference: "6.2.2",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Workload Identity Disabled",
            flagged_items: 0,
            id_suffix: "workload_identity_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "Enabling Workload Identity manages the distribution and rotation of Service account keys for the workloads to use.<br>Kubernetes workloads should not use cluster node service accounts to authenticate to Google Cloud APIs. Each Kubernetes Workload that needs to authenticate to other Google services using Cloud IAM should be provisioned a dedicated Service account.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-dashboard-enabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.6",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.10.1",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Kubernetes Dashboard Enabled",
            flagged_items: 0,
            id_suffix: "dashboard_status",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "You should disable the Kubernetes Web UI (Dashboard) when running on Kubernetes Engine. The Kubernetes Web UI (Dashboard) is backed by a highly privileged Kubernetes Service Account. The Cloud Console provides much of the same functionality, so you don't need this functionality.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#disable_kubernetes_dashboard",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-default-service-account-used": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.17",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.2.1",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Default Service Account in Use",
            flagged_items: 0,
            id_suffix: "default_service_account_used",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "Each GKE node has a Service Account associated with it. By default, nodes are given the Compute Engine default service account. This account has broad access by default, making it useful to wide variety of applications, but it has more permissions than are required to run your Kubernetes Engine cluster. You should create and use a minimally privileged service account to run your GKE cluster instead of using the Compute Engine default service account.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#use_least_privilege_sa",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-legacy-abac-enabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.3",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.8.4",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Legacy Authorization (ABAC) Enabled",
            flagged_items: 0,
            id_suffix: "legacy_abac_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "The legacy authorizer in Kubernetes grants broad, statically defined permissions. To ensure that RBAC limits permissions correctly, you must disable the legacy authorizer. RBAC has significant security advantages, can help you ensure that users only have access to cluster resources within their own namespace and is now stable in Kubernetes.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#leave_abac_disabled_default_for_110",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-legacy-metadata-endpoints-enabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS GKE Benchmark",
                reference: "6.4.1",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Legacy Metadata Endpoints Enabled",
            display_path: "kubernetesengine.projects.id.clusters.id",
            flagged_items: 0,
            id_suffix: "legacy_metadata_endpoints_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id.node_pools.id",
            rationale:
              "The instance metadata server exposed legacy v0.1 and v1beta1 endpoints, which do not enforce metadata query headers. This is a feature in the v1 APIs that makes it more difficult for a potential attacker to retrieve instance metadata, such as Server-Side Request Forgery (SSRF). Unless specifically required, we recommend you disable these legacy APIs.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#protect_node_metadata_default_for_112",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-node-auto-repair-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.7",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.5.2",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Nodes with Auto-Repair Disabled",
            display_path: "kubernetesengine.projects.id.clusters.id",
            flagged_items: 0,
            id_suffix: "auto_repair_disabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id.node_pools.id",
            rationale:
              "Auto-repair helps maintain the cluster nodes in a healthy, running state.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-repair",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-node-auto-upgrade-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.8",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.5.3",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Nodes with Auto-Upgrade Disabled",
            display_path: "kubernetesengine.projects.id.clusters.id",
            flagged_items: 0,
            id_suffix: "auto_upgrade_disabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id.node_pools.id",
            rationale:
              "Auto-upgrades automatically ensures that security updates are applied and kept up to date.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-upgrades",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-node-container-optimized-os-not-used": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.9",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.5.1",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Lack of Container-Optimized OS Node Images",
            flagged_items: 0,
            id_suffix: "container_optimized_os_not_used",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "It is recommended to use container-optimized OS images, as they provide improved support, security and stability.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/container-optimized-os/docs/concepts/features-and-benefits",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/node-images",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-node-integrity-monitoring-disabled": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Clusters",
            description: "Nodes with Integrity Monitoring Disabled",
            display_path: "kubernetesengine.projects.id.clusters.id",
            flagged_items: 0,
            id_suffix: "integrity_monitoring_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id.node_pools.id",
            rationale:
              "The Integrity Monitoring feature should be enabled for GKE cluster nodes in order to monitor and automatically check the runtime boot integrity of shielded cluster nodes using Cloud Monitoring service.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/shielded-gke-nodes",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-node-secure-boot-disabled": {
            checked_items: 0,
            compliance: null,
            dashboard_name: "Clusters",
            description: "Nodes with Secure Boot Disabled",
            display_path: "kubernetesengine.projects.id.clusters.id",
            flagged_items: 0,
            id_suffix: "secure_boot_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id.node_pools.id",
            rationale:
              "The Secure Boot feature should be enabled for GKE cluster nodes in order to protect them against malware and rootkits. Secure Boot helps ensure that the system runs only authentic software by verifying the digital signature of all boot components, and halting the boot process if the signature verification fails.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/shielded-gke-nodes",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-private-nodes-disabled": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.15",
                version: "1.0.0",
              },
              {
                name: "CIS GKE Benchmark",
                reference: "6.6.5",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Private Cluster Nodes Disabled",
            flagged_items: 0,
            id_suffix: "private_nodes_enabled",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "Private Nodes are nodes with no public IP addresses. Disabling public IP addresses on cluster nodes restricts access to only internal networks, forcing attackers to obtain local network access before attempting to compromise the underlying Kubernetes hosts.",
            references: [
              "https://www.cisecurity.org/benchmark/kubernetes/",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#restrict_network_access_to_the_control_plane_and_nodes",
              "https://cloud.google.com/kubernetes-engine/docs/concepts/cis-benchmarks#default_values_on",
              "https://cloud.google.com/kubernetes-engine/docs/how-to/private-clusters",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
          "kubernetesengine-scopes-not-limited": {
            checked_items: 0,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "7.18",
                version: "1.0.0",
              },
            ],
            dashboard_name: "Clusters",
            description: "Lack of Access Scope Limitation",
            flagged_items: 0,
            id_suffix: "scopes_not_limited",
            items: [],
            level: "warning",
            path: "kubernetesengine.projects.id.clusters.id",
            rationale:
              "If you are not creating a separate service account for your nodes, you should limit the scopes of the node service account to reduce the oportunity for privilege escalation. This ensures that the default service account does not have permissions beyond those necessary to run your cluster. While the default scopes are limited, they may include scopes beyond the minimally required ones needed to run your cluster. If you are accessing private images in Google Container Registry, the minimally required scopes are only logging.write, monitoring, and devstorage.read_only.",
            references: [
              "https://cloud.google.com/kubernetes-engine/docs/how-to/access-scopes",
            ],
            remediation: null,
            service: "Kubernetes Engine",
          },
        },
        projects: {
          "cordova-358e9": {
            clusters: {},
            clusters_count: 0,
          },
        },
      },
      stackdriverlogging: {
        filters: {},
        findings: {
          "stackdriverlogging-metric-filter-does-not-exist-audit-config-changes":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.5",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Logging Configurations",
              description:
                "Log Metric Filter Doesn't Exist for Audit Configuration Changes",
              flagged_items: 1,
              id_suffix: "audit_config_change",
              items: [
                "stackdriverlogging.projects.cordova-358e9.logging_metrics.cordova-358e9.audit_config_change",
              ],
              level: "warning",
              path: "stackdriverlogging.projects.id.logging_metrics.id",
              rationale:
                "Configuring the metric filter and alerts for audit configuration changes ensures the recommended state of audit configuration is maintained so that all activities in the project are audit-able at any point in time.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
                "https://cloud.google.com/logging/docs/audit/configure-data-access#getiampolicy-setiampolicy",
              ],
              remediation:
                'From console: <ol><li>Go to <samp>Logging/Logs</samp> by visiting https://console.cloud.google.com/logs/metrics and click "CREATE METRIC".</li><li>Click the down arrow symbol on the <samp>Filter Bar</samp> at the rightmost corner and select <samp>Convert to Advanced Filter</samp>.</li><li>Clear any text and add: <br> <samp> protoPayload.methodName="SetIamPolicy" AND protoPayload.serviceData.policyDelta.auditConfigDeltas:*</samp></li><li>Click <samp>Submit Filter</samp>. The logs display based on the filter text entered by the user.</li><li>In the <samp>Metric Editor</samp> menu on the right,fill out the name field. Set <samp>Units</samp> to <samp>1</samp>(default) and the <samp>Type</samp> to <samp>Counter</samp>. This ensures that the log metric counts the number of log entries matching the advanced logs query.</li><li>Click <samp>CreateMetric</samp>.</li></ol>',
              service: "Stackdriver Logging",
            },
          "stackdriverlogging-metric-filter-does-not-exist-cloud-storage-iam-permission-changes":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.10",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Logging Configurations",
              description:
                "Log Metric Filter Doesn't Exist for Cloud Storage IAM Permission Changes",
              flagged_items: 1,
              id_suffix: "cloud_storage_iam_permission_change",
              items: [
                "stackdriverlogging.projects.cordova-358e9.logging_metrics.cordova-358e9.cloud_storage_iam_permission_change",
              ],
              level: "warning",
              path: "stackdriverlogging.projects.id.logging_metrics.id",
              rationale:
                "Monitoring changes to cloud storage bucket permissions may reduce the time needed to detect and correct permissions on sensitive cloud storage buckets and objects inside the bucket.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
                "https://cloud.google.com/storage/docs",
                "https://cloud.google.com/storage/docs/access-control/iam-roles",
              ],
              remediation:
                'From console: <ol><li>Go to <samp>Logging/Logs</samp> by visiting https://console.cloud.google.com/logs/metrics and click "CREATE METRIC".</li><li>Click the down arrow symbol on the <samp>Filter Bar</samp> at the rightmost corner and select <samp>Convert to Advanced Filter</samp>.</li><li>Clear any text and add: <br> <samp> resource.type=gcs_bucket AND protoPayload.methodName="storage.setIamPermissions"</samp></li><li>Click <samp>Submit Filter</samp>. The logs display based on the filter text entered by the user.</li><li>In the <samp>Metric Editor</samp> menu on the right,fill out the name field. Set <samp>Units</samp> to <samp>1</samp>(default) and the <samp>Type</samp> to <samp>Counter</samp>. This ensures that the log metric counts the number of log entries matching the advanced logs query.</li><li>Click <samp>CreateMetric</samp>.</li></ol>',
              service: "Stackdriver Logging",
            },
          "stackdriverlogging-metric-filter-does-not-exist-custom-role-changes":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.6",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Logging Configurations",
              description:
                "Log Metric Filter Doesn't Exist for Custom Role Changes",
              flagged_items: 1,
              id_suffix: "custom_role_change",
              items: [
                "stackdriverlogging.projects.cordova-358e9.logging_metrics.cordova-358e9.custom_role_change",
              ],
              level: "warning",
              path: "stackdriverlogging.projects.id.logging_metrics.id",
              rationale:
                "Google Cloud IAM provides predefined roles that give granular access to specific Google Cloud Platform resources and prevent unwanted access to other resources. However, to cater to organization-specific needs, Cloud IAM also provides the ability to create custom roles. Project owners and administrators with the Organization Role Administrator role or the IAM Role Administrator role can create custom roles. Monitoring role creation, deletion and updating activities will help in identifying any over-privileged role at early stages.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
                "https://cloud.google.com/iam/docs/understanding-custom-roles",
              ],
              remediation:
                'From console: <ol><li>Go to <samp>Logging/Logs</samp> by visiting https://console.cloud.google.com/logs/metrics and click "CREATE METRIC".</li><li>Click the down arrow symbol on the <samp>Filter Bar</samp> at the rightmost corner and select <samp>Convert to Advanced Filter</samp>.</li><li>Clear any text and add: <br> <samp> resource.type="iam_role" AND protoPayload.methodName =  "google.iam.admin.v1.CreateRole" OR protoPayload.methodName="google.iam.admin.v1.DeleteRole" OR protoPayload.methodName="google.iam.admin.v1.UpdateRole"</samp></li><li>Click <samp>Submit Filter</samp>. The logs display based on the filter text entered by the user.</li><li>In the <samp>Metric Editor</samp> menu on the right,fill out the name field. Set <samp>Units</samp> to <samp>1</samp>(default) and the <samp>Type</samp> to <samp>Counter</samp>. This ensures that the log metric counts the number of log entries matching the advanced logs query.</li><li>Click <samp>CreateMetric</samp>.</li></ol>',
              service: "Stackdriver Logging",
            },
          "stackdriverlogging-metric-filter-does-not-exist-project-ownership-assignment":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.4",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Logging Configurations",
              description:
                "Log Metric Filter Doesn't Exist for Project Ownership Assignments/Changes",
              flagged_items: 1,
              id_suffix: "project_ownership_assignments",
              items: [
                "stackdriverlogging.projects.cordova-358e9.logging_metrics.cordova-358e9.project_ownership_assignments",
              ],
              level: "warning",
              path: "stackdriverlogging.projects.id.logging_metrics.id",
              rationale:
                "Project ownership has the highest level of privileges on a project. To avoid misuse of project resources, the project ownership assignment/change actions mentioned above should be monitored and alerted to concerned recipients.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
              ],
              remediation:
                'From console: <ol><li>Go to <samp>Logging/Logs</samp> by visiting https://console.cloud.google.com/logs/metrics and click "CREATE METRIC".</li><li>Click the down arrow symbol on the <samp>Filter Bar</samp> at the rightmost corner and select <samp>Convert to Advanced Filter</samp>.</li><li>Clear any text and add: <br> <samp> (protoPayload.serviceName="cloudresourcemanager.googleapis.com") AND (ProjectOwnership OR projectOwnerInvitee) OR (protoPayload.serviceData.policyDelta.bindingDeltas.action="REMOVE" AND protoPayload.serviceData.policyDelta.bindingDeltas.role="roles/owner") OR (protoPayload.serviceData.policyDelta.bindingDeltas.action="ADD" AND protoPayload.serviceData.policyDelta.bindingDeltas.role="roles/owner")</samp></li><li>Click <samp>Submit Filter</samp>. The logs display based on the filter text entered by the user.</li><li>In the <samp>Metric Editor</samp> menu on the right,fill out the name field. Set <samp>Units</samp> to <samp>1</samp>(default) and the <samp>Type</samp> to <samp>Counter</samp>. This ensures that the log metric counts the number of log entries matching the advanced logs query.</li><li>Click <samp>CreateMetric</samp>.</li></ol>',
              service: "Stackdriver Logging",
            },
          "stackdriverlogging-metric-filter-does-not-exist-sql-instance-config-changes":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.11",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Logging Configurations",
              description:
                "Log Metric Filter Doesn't Exist for SQL Instance Configuration Changes",
              flagged_items: 1,
              id_suffix: "sql_instance_conf_change",
              items: [
                "stackdriverlogging.projects.cordova-358e9.logging_metrics.cordova-358e9.sql_instance_conf_change",
              ],
              level: "warning",
              path: "stackdriverlogging.projects.id.logging_metrics.id",
              rationale:
                "Monitoring changes to SQL instance configuration changes may reduce the time needed to detect and correct misconfigurations done on the SQL server.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
                "https://cloud.google.com/storage/docs",
                "https://cloud.google.com/sql/docs/",
                "https://cloud.google.com/sql/docs/mysql/",
                "https://cloud.google.com/sql/docs/postgres/",
              ],
              remediation:
                'From console: <ol><li>Go to <samp>Logging/Logs</samp> by visiting https://console.cloud.google.com/logs/metrics and click "CREATE METRIC".</li><li>Click the down arrow symbol on the <samp>Filter Bar</samp> at the rightmost corner and select <samp>Convert to Advanced Filter</samp>.</li><li>Clear any text and add: <br> <samp> protoPayload.methodName="cloudsql.instances.update"</samp></li><li>Click <samp>Submit Filter</samp>. The logs display based on the filter text entered by the user.</li><li>In the <samp>Metric Editor</samp> menu on the right,fill out the name field. Set <samp>Units</samp> to <samp>1</samp>(default) and the <samp>Type</samp> to <samp>Counter</samp>. This ensures that the log metric counts the number of log entries matching the advanced logs query.</li><li>Click <samp>CreateMetric</samp>.</li></ol>',
              service: "Stackdriver Logging",
            },
          "stackdriverlogging-metric-filter-does-not-exist-vpc-network-changes":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.9",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Logging Configurations",
              description:
                "Log Metric Filter Doesn't Exist for VPC Network Changes",
              flagged_items: 1,
              id_suffix: "vpc_network_change",
              items: [
                "stackdriverlogging.projects.cordova-358e9.logging_metrics.cordova-358e9.vpc_network_change",
              ],
              level: "warning",
              path: "stackdriverlogging.projects.id.logging_metrics.id",
              rationale:
                "It is possible to have more than one VPC within a project. In addition, it is also possible to create a peer connection between two VPCs enablingnetwork traffic to route between VPCs.Monitoring changes to a VPC will help ensure VPC traffic flow is not getting impacted.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
                "https://cloud.google.com/vpc/docs/overview",
              ],
              remediation:
                'From console: <ol><li>Go to <samp>Logging/Logs</samp> by visiting https://console.cloud.google.com/logs/metrics and click "CREATE METRIC".</li><li>Click the down arrow symbol on the <samp>Filter Bar</samp> at the rightmost corner and select <samp>Convert to Advanced Filter</samp>.</li><li>Clear any text and add: <br> <samp>resource.type=gce_network AND jsonPayload.event_subtype="compute.networks.insert" \n85| P a g eOR jsonPayload.event_subtype="compute.networks.patch" OR jsonPayload.event_subtype="compute.networks.delete"  OR jsonPayload.event_subtype="compute.networks.removePeering" OR jsonPayload.event_subtype="compute.networks.addPeering" </samp></li><li>Click <samp>Submit Filter</samp>. The logs display based on the filter text entered by the user.</li><li>In the <samp>Metric Editor</samp> menu on the right,fill out the name field. Set <samp>Units</samp> to <samp>1</samp>(default) and the <samp>Type</samp> to <samp>Counter</samp>. This ensures that the log metric counts the number of log entries matching the advanced logs query.</li><li>Click <samp>CreateMetric</samp>.</li></ol>',
              service: "Stackdriver Logging",
            },
          "stackdriverlogging-metric-filter-does-not-exist-vpc-network-firewall-rule-changes":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.7",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Logging Configurations",
              description:
                "Log Metric Filter Doesn't Exist for VPC Network Firewall Rule Changes",
              flagged_items: 1,
              id_suffix: "vpc_network_firewall_rule_change",
              items: [
                "stackdriverlogging.projects.cordova-358e9.logging_metrics.cordova-358e9.vpc_network_firewall_rule_change",
              ],
              level: "warning",
              path: "stackdriverlogging.projects.id.logging_metrics.id",
              rationale:
                "Monitoring for Create or Update Firewall rule events gives insight to network access changes and may reduce the time it takes to detect suspicious activity.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
                "https://cloud.google.com/vpc/docs/firewalls",
              ],
              remediation:
                'From console: <ol><li>Go to <samp>Logging/Logs</samp> by visiting https://console.cloud.google.com/logs/metrics and click "CREATE METRIC".</li><li>Click the down arrow symbol on the <samp>Filter Bar</samp> at the rightmost corner and select <samp>Convert to Advanced Filter</samp>.</li><li>Clear any text and add: <br> <samp> resource.type="gce_firewall_rule" AND jsonPayload.event_subtype="compute.firewalls.patch" OR jsonPayload.event_subtype="compute.firewalls.insert"</samp></li><li>Click <samp>Submit Filter</samp>. The logs display based on the filter text entered by the user.</li><li>In the <samp>Metric Editor</samp> menu on the right,fill out the name field. Set <samp>Units</samp> to <samp>1</samp>(default) and the <samp>Type</samp> to <samp>Counter</samp>. This ensures that the log metric counts the number of log entries matching the advanced logs query.</li><li>Click <samp>CreateMetric</samp>.</li></ol>',
              service: "Stackdriver Logging",
            },
          "stackdriverlogging-metric-filter-does-not-exist-vpc-network-route-changes":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.8",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Logging Configurations",
              description:
                "Log Metric Filter Doesn't Exist for VPC Network Route Changes",
              flagged_items: 1,
              id_suffix: "vpc_network_route_change",
              items: [
                "stackdriverlogging.projects.cordova-358e9.logging_metrics.cordova-358e9.vpc_network_route_change",
              ],
              level: "warning",
              path: "stackdriverlogging.projects.id.logging_metrics.id",
              rationale:
                "Google Cloud Platform (GCP) routes define the paths network traffic takes from a VM instance to another destination. The other destination can be inside the organization VPC network (such as another VM) or outside of it. Every route consists of a destination and a next hop. Traffic whose destination IP is within the destination range is sent to the next hop for delivery. Monitoring changes to route tables will help ensure that all VPC traffic flows through an expected path.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
                "https://cloud.google.com/storage/docs/access-control/iam",
              ],
              remediation:
                'From console: <ol><li>Go to <samp>Logging/Logs</samp> by visiting https://console.cloud.google.com/logs/metrics and click "CREATE METRIC".</li><li>Click the down arrow symbol on the <samp>Filter Bar</samp> at the rightmost corner and select <samp>Convert to Advanced Filter</samp>.</li><li>Clear any text and add: <br> <samp> resource.type="gce_route" AND jsonPayload.event_subtype="compute.routes.delete" OR jsonPayload.event_subtype="compute.routes.insert"</samp></li><li>Click <samp>Submit Filter</samp>. The logs display based on the filter text entered by the user.</li><li>In the <samp>Metric Editor</samp> menu on the right,fill out the name field. Set <samp>Units</samp> to <samp>1</samp>(default) and the <samp>Type</samp> to <samp>Counter</samp>. This ensures that the log metric counts the number of log entries matching the advanced logs query.</li><li>Click <samp>CreateMetric</samp>.</li></ol>',
              service: "Stackdriver Logging",
            },
          "stackdriverlogging-no-export-sinks": {
            checked_items: 1,
            compliance: null,
            dashboard_name: "Logging Configurations",
            description: "Lack of Export Sinks",
            display_path: "stackdriverlogging.projects.id.sinks",
            flagged_items: 1,
            items: ["stackdriverlogging.projects.cordova-358e9"],
            level: "warning",
            path: "stackdriverlogging.projects.id",
            rationale:
              "Export sinks for Stackdriver logging were not found. As a result, logs would be deleted after the configured retention period, and would not be backed up.",
            references: [
              "https://cloud.google.com/logging",
              "https://cloud.google.com/logging/docs/export",
            ],
            remediation: null,
            service: "Stackdriver Logging",
          },
        },
        logging_metrics_count: 1,
        metrics_count: 0,
        projects: {
          "cordova-358e9": {
            logging_metrics: {
              "cordova-358e9": {
                audit_config_change: false,
                cloud_storage_iam_permission_change: false,
                custom_role_change: false,
                project_ownership_assignments: false,
                sql_instance_conf_change: false,
                vpc_network_change: false,
                vpc_network_firewall_rule_change: false,
                vpc_network_route_change: false,
              },
            },
            logging_metrics_count: 1,
            metrics: {},
            metrics_count: 0,
            sinks: {},
            sinks_count: 0,
          },
        },
        sinks_count: 0,
      },
      stackdrivermonitoring: {
        alert_policies_count: 0,
        filters: {},
        findings: {
          "stackdrivermonitoring-alerts-does-not-exist-audit-config-changes": {
            checked_items: 1,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "2.5",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Monitoring Alerts",
            description: "Alerts Doesn't Exist for Audit Configuration Changes",
            flagged_items: 1,
            id_suffix: "audit_config_change",
            items: [
              "stackdrivermonitoring.projects.cordova-358e9.monitoring_alert_policies.cordova-358e9.audit_config_change",
            ],
            level: "warning",
            path: "stackdrivermonitoring.projects.id.monitoring_alert_policies.id",
            rationale:
              "Configuring the metric filter and alerts for audit configuration changes ensures the recommended state of audit configuration is maintained so that all activities in the project are audit-able at any point in time.",
            references: [
              "https://cloud.google.com/logging/docs/logs-based-metrics/",
              "https://cloud.google.com/monitoring/custom-metrics/",
              "https://cloud.google.com/monitoring/alerts/",
              "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
              "https://cloud.google.com/logging/docs/audit/configure-data-access#getiampolicy-setiampolicy",
            ],
            remediation:
              "From console: <ol><li>Identify the audit configuration changes metric under the section <samp>User-defined Metrics</samp> at https://console.cloud.google.com/logs/metrics.</li><li>Click the 3-dot icon in the rightmost column for the desired metric and select <samp>Create alert from Metric</samp>. A new page opens.</li><li>Fill out the alert policy configuration and click <samp>Save</samp>. Choose the alerting threshold and configuration that makes sense for the user's organization. For example, a threshold of zero(0) for the most recent value will ensure that a notification is triggered for every owner change in the project:: <br> <samp>Set `Aggregator` to `Count`<br> Set `Configuration`: <br> -Condition: above <br> -Threshold: 0 <br> -For: most recent value </samp></li><li>Configure the desired notifications channels in the section <samp>Notifications.</samp></li><li>Name the policy and click <samp>Save</samp>.</li></ol>",
            service: "Stackdriver Monitoring",
          },
          "stackdrivermonitoring-alerts-does-not-exist-cloud-storage-iam-permission-changes":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.10",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Monitoring Alerts",
              description:
                "Alerts Doesn't Exist for Cloud Storage IAM Permission Changes",
              flagged_items: 1,
              id_suffix: "cloud_storage_iam_permission_change",
              items: [
                "stackdrivermonitoring.projects.cordova-358e9.monitoring_alert_policies.cordova-358e9.cloud_storage_iam_permission_change",
              ],
              level: "warning",
              path: "stackdrivermonitoring.projects.id.monitoring_alert_policies.id",
              rationale:
                "Monitoring changes to cloud storage bucket permissions may reduce the time needed to detect and correct permissions on sensitive cloud storage buckets and objects inside the bucket.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
                "https://cloud.google.com/storage/docs",
                "https://cloud.google.com/storage/docs/access-control/iam-roles",
              ],
              remediation:
                "From console: <ol><li>Identify the cloud storage IAM permission changes metric under the section <samp>User-defined Metrics</samp> at https://console.cloud.google.com/logs/metrics.</li><li>Click the 3-dot icon in the rightmost column for the desired metric and select <samp>Create alert from Metric</samp>. A new page opens.</li><li>Fill out the alert policy configuration and click <samp>Save</samp>. Choose the alerting threshold and configuration that makes sense for the user's organization. For example, a threshold of zero(0) for the most recent value will ensure that a notification is triggered for every owner change in the project:: <br> <samp>Set `Aggregator` to `Count`<br> Set `Configuration`: <br> -Condition: above <br> -Threshold: 0 <br> -For: most recent value </samp></li><li>Configure the desired notifications channels in the section <samp>Notifications.</samp></li><li>Name the policy and click <samp>Save</samp>.</li></ol>",
              service: "Stackdriver Monitoring",
            },
          "stackdrivermonitoring-alerts-does-not-exist-custom-role-changes": {
            checked_items: 1,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "2.6",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Monitoring Alerts",
            description: "Alerts Doesn't Exist for Custom Role Changes",
            flagged_items: 1,
            id_suffix: "custom_role_change",
            items: [
              "stackdrivermonitoring.projects.cordova-358e9.monitoring_alert_policies.cordova-358e9.custom_role_change",
            ],
            level: "warning",
            path: "stackdrivermonitoring.projects.id.monitoring_alert_policies.id",
            rationale:
              "Google Cloud IAM provides predefined roles that give granular access to specific Google Cloud Platform resources and prevent unwanted access to other resources. However, to cater to organization-specific needs, Cloud IAM also provides the ability to create custom roles. Project owners and administrators with the Organization Role Administrator role or the IAM Role Administrator role can create custom roles. Monitoring role creation, deletion and updating activities will help in identifying any over-privileged role at early stages.",
            references: [
              "https://cloud.google.com/logging/docs/logs-based-metrics/",
              "https://cloud.google.com/monitoring/custom-metrics/",
              "https://cloud.google.com/monitoring/alerts/",
              "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
              "https://cloud.google.com/iam/docs/understanding-custom-roles",
            ],
            remediation:
              "From console: <ol><li>Identify the custom role changes metric under the section <samp>User-defined Metrics</samp> at https://console.cloud.google.com/logs/metrics.</li><li>Click the 3-dot icon in the rightmost column for the desired metric and select <samp>Create alert from Metric</samp>. A new page opens.</li><li>Fill out the alert policy configuration and click <samp>Save</samp>. Choose the alerting threshold and configuration that makes sense for the user's organization. For example, a threshold of zero(0) for the most recent value will ensure that a notification is triggered for every owner change in the project:: <br> <samp>Set `Aggregator` to `Count`<br> Set `Configuration`: <br> -Condition: above <br> -Threshold: 0 <br> -For: most recent value </samp></li><li>Configure the desired notifications channels in the section <samp>Notifications.</samp></li><li>Name the policy and click <samp>Save</samp>.</li></ol>",
            service: "Stackdriver Monitoring",
          },
          "stackdrivermonitoring-alerts-does-not-exist-project-ownership-assignment":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.4",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Monitoring Alerts",
              description:
                "Alerts Doesn't Exist for Project Ownership Assignments/Changes",
              flagged_items: 1,
              id_suffix: "project_ownership_assignments",
              items: [
                "stackdrivermonitoring.projects.cordova-358e9.monitoring_alert_policies.cordova-358e9.project_ownership_assignments",
              ],
              level: "warning",
              path: "stackdrivermonitoring.projects.id.monitoring_alert_policies.id",
              rationale:
                "Project ownership has the highest level of privileges on a project. To avoid misuse of project resources, the project ownership assignment/change actions mentioned above should be monitored and alerted to concerned recipients.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
              ],
              remediation:
                "From console: <ol><li>Identify the project ownership assignment/changes metric under the section <samp>User-defined Metrics</samp> at https://console.cloud.google.com/logs/metrics.</li><li>Click the 3-dot icon in the rightmost column for the desired metric and select <samp>Create alert from Metric</samp>. A new page opens.</li><li>Fill out the alert policy configuration and click <samp>Save</samp>. Choose the alerting threshold and configuration that makes sense for the user's organization. For example, a threshold of zero(0) for the most recent value will ensure that a notification is triggered for every owner change in the project:: <br> <samp>Set `Aggregator` to `Count`<br> Set `Configuration`: <br> -Condition: above <br> -Threshold: 0 <br> -For: most recent value </samp></li><li>Configure the desired notifications channels in the section <samp>Notifications.</samp></li><li>Name the policy and click <samp>Save</samp>.</li></ol>",
              service: "Stackdriver Monitoring",
            },
          "stackdrivermonitoring-alerts-does-not-exist-sql-instance-config-changes":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.11",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Monitoring Alerts",
              description:
                "Alerts Doesn't Exist for SQL Instance Configuration Changes",
              flagged_items: 1,
              id_suffix: "sql_instance_conf_change",
              items: [
                "stackdrivermonitoring.projects.cordova-358e9.monitoring_alert_policies.cordova-358e9.sql_instance_conf_change",
              ],
              level: "warning",
              path: "stackdrivermonitoring.projects.id.monitoring_alert_policies.id",
              rationale:
                "Monitoring changes to SQL instance configuration changes may reduce the time needed to detect and correct misconfigurations done on the SQL server.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
                "https://cloud.google.com/storage/docs",
                "https://cloud.google.com/sql/docs/",
                "https://cloud.google.com/sql/docs/mysql/",
                "https://cloud.google.com/sql/docs/postgres/",
              ],
              remediation:
                "From console: <ol><li>Identify the sql instance configuration changes metric under the section <samp>User-defined Metrics</samp> at https://console.cloud.google.com/logs/metrics.</li><li>Click the 3-dot icon in the rightmost column for the desired metric and select <samp>Create alert from Metric</samp>. A new page opens.</li><li>Fill out the alert policy configuration and click <samp>Save</samp>. Choose the alerting threshold and configuration that makes sense for the user's organization. For example, a threshold of zero(0) for the most recent value will ensure that a notification is triggered for every owner change in the project:: <br> <samp>Set `Aggregator` to `Count`<br> Set `Configuration`: <br> -Condition: above <br> -Threshold: 0 <br> -For: most recent value </samp></li><li>Configure the desired notifications channels in the section <samp>Notifications.</samp></li><li>Name the policy and click <samp>Save</samp>.</li></ol>",
              service: "Stackdriver Monitoring",
            },
          "stackdrivermonitoring-alerts-does-not-exist-vpc-network-changes": {
            checked_items: 1,
            compliance: [
              {
                name: "CIS Google Cloud Platform Foundations",
                reference: "2.9",
                version: "1.1.0",
              },
            ],
            dashboard_name: "Monitoring Alerts",
            description: "Alerts Doesn't Exist for VPC Network Changes",
            flagged_items: 1,
            id_suffix: "vpc_network_change",
            items: [
              "stackdrivermonitoring.projects.cordova-358e9.monitoring_alert_policies.cordova-358e9.vpc_network_change",
            ],
            level: "warning",
            path: "stackdrivermonitoring.projects.id.monitoring_alert_policies.id",
            rationale:
              "It is possible to have more than one VPC within a project. In addition, it is also possible to create a peer connection between two VPCs enablingnetwork traffic to route between VPCs. Monitoring changes to a VPC will help ensure VPC traffic flow is not getting impacted.",
            references: [
              "https://cloud.google.com/logging/docs/logs-based-metrics/",
              "https://cloud.google.com/monitoring/custom-metrics/",
              "https://cloud.google.com/monitoring/alerts/",
              "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
              "https://cloud.google.com/vpc/docs/overview",
            ],
            remediation:
              "From console: <ol><li>Identify the vpc network changes metric under the section <samp>User-defined Metrics</samp> at https://console.cloud.google.com/logs/metrics.</li><li>Click the 3-dot icon in the rightmost column for the desired metric and select <samp>Create alert from Metric</samp>. A new page opens.</li><li>Fill out the alert policy configuration and click <samp>Save</samp>. Choose the alerting threshold and configuration that makes sense for the user's organization. For example, a threshold of zero(0) for the most recent value will ensure that a notification is triggered for every owner change in the project:: <br> <samp>Set `Aggregator` to `Count`<br> Set `Configuration`: <br> -Condition: above <br> -Threshold: 0 <br> -For: most recent value </samp></li><li>Configure the desired notifications channels in the section <samp>Notifications.</samp></li><li>Name the policy and click <samp>Save</samp>.</li></ol>",
            service: "Stackdriver Monitoring",
          },
          "stackdrivermonitoring-alerts-does-not-exist-vpc-network-firewall-rule-changes":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.7",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Monitoring Alerts",
              description:
                "Alerts Doesn't Exist for VPC Network Firewall Rule Changes",
              flagged_items: 1,
              id_suffix: "vpc_network_firewall_rule_change",
              items: [
                "stackdrivermonitoring.projects.cordova-358e9.monitoring_alert_policies.cordova-358e9.vpc_network_firewall_rule_change",
              ],
              level: "warning",
              path: "stackdrivermonitoring.projects.id.monitoring_alert_policies.id",
              rationale:
                "Monitoring for Create or Update Firewall rule events gives insight to network access changes and may reduce the time it takes to detect suspicious activity.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
                "https://cloud.google.com/vpc/docs/firewalls",
              ],
              remediation:
                "From console: <ol><li>Identify the vpc network firewall rule changes metric under the section <samp>User-defined Metrics</samp> at https://console.cloud.google.com/logs/metrics.</li><li>Click the 3-dot icon in the rightmost column for the desired metric and select <samp>Create alert from Metric</samp>. A new page opens.</li><li>Fill out the alert policy configuration and click <samp>Save</samp>. Choose the alerting threshold and configuration that makes sense for the user's organization. For example, a threshold of zero(0) for the most recent value will ensure that a notification is triggered for every owner change in the project:: <br> <samp>Set `Aggregator` to `Count`<br> Set `Configuration`: <br> -Condition: above <br> -Threshold: 0 <br> -For: most recent value </samp></li><li>Configure the desired notifications channels in the section <samp>Notifications.</samp></li><li>Name the policy and click <samp>Save</samp>.</li></ol>",
              service: "Stackdriver Monitoring",
            },
          "stackdrivermonitoring-alerts-does-not-exist-vpc-network-route-changes":
            {
              checked_items: 1,
              compliance: [
                {
                  name: "CIS Google Cloud Platform Foundations",
                  reference: "2.8",
                  version: "1.1.0",
                },
              ],
              dashboard_name: "Monitoring Alerts",
              description: "Alerts Doesn't Exist for VPC Network Route Changes",
              flagged_items: 1,
              id_suffix: "vpc_network_route_change",
              items: [
                "stackdrivermonitoring.projects.cordova-358e9.monitoring_alert_policies.cordova-358e9.vpc_network_route_change",
              ],
              level: "warning",
              path: "stackdrivermonitoring.projects.id.monitoring_alert_policies.id",
              rationale:
                "Google Cloud Platform (GCP) routes define the paths network traffic takes from a VM instance to another destination. The other destination can be inside the organization VPC network (such as another VM) or outside of it. Every route consists of a destination and a next hop. Traffic whose destination IP is within the destination range is sent to the next hop for delivery. Monitoring changes to route tables will help ensure that all VPC traffic flows through an expected path.",
              references: [
                "https://cloud.google.com/logging/docs/logs-based-metrics/",
                "https://cloud.google.com/monitoring/custom-metrics/",
                "https://cloud.google.com/monitoring/alerts/",
                "https://cloud.google.com/logging/docs/reference/tools/gcloud-logging",
                "https://cloud.google.com/storage/docs/access-control/iam",
              ],
              remediation:
                "From console: <ol><li>Identify the vpc network route changes metric under the section <samp>User-defined Metrics</samp> at https://console.cloud.google.com/logs/metrics.</li><li>Click the 3-dot icon in the rightmost column for the desired metric and select <samp>Create alert from Metric</samp>. A new page opens.</li><li>Fill out the alert policy configuration and click <samp>Save</samp>. Choose the alerting threshold and configuration that makes sense for the user's organization. For example, a threshold of zero(0) for the most recent value will ensure that a notification is triggered for every owner change in the project:: <br> <samp>Set `Aggregator` to `Count`<br> Set `Configuration`: <br> -Condition: above <br> -Threshold: 0 <br> -For: most recent value </samp></li><li>Configure the desired notifications channels in the section <samp>Notifications.</samp></li><li>Name the policy and click <samp>Save</samp>.</li></ol>",
              service: "Stackdriver Monitoring",
            },
        },
        monitoring_alert_policies_count: 1,
        projects: {
          "cordova-358e9": {
            alert_policies: {},
            alert_policies_count: 0,
            monitoring_alert_policies: {
              "cordova-358e9": {
                audit_config_change: false,
                cloud_storage_iam_permission_change: false,
                custom_role_change: false,
                project_ownership_assignments: false,
                sql_instance_conf_change: false,
                vpc_network_change: false,
                vpc_network_firewall_rule_change: false,
                vpc_network_route_change: false,
              },
            },
            monitoring_alert_policies_count: 1,
            uptime_checks: {},
            uptime_checks_count: 0,
          },
        },
        uptime_checks_count: 0,
      },
    },
  };

  return scanData;
}

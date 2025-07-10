import { CardWithProgess } from "../components/cardWithProgress";

export default function ControlCards() {
    return (
        <>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 mt-3">
                <CardWithProgess
                    title="ISO 27001"
                    compliancePercentage={85}
                    implemented={97}
                    totalControls={114}
                />
                <CardWithProgess
                    title="NIST CSF"
                    compliancePercentage={78}
                    implemented={84}
                    totalControls={108}
                    progressColor = "bg-purple-500"
                />
                <CardWithProgess
                    title="OWASP Top 10"
                    compliancePercentage={92}
                    implemented={9}
                    totalControls={10}
                    progressColor = "bg-pink-500"
                />
                <CardWithProgess
                    title="SOC 2"
                    compliancePercentage={88}
                    implemented={56}
                    totalControls={64}
                    progressColor = "bg-yellow-500"
                />
                <CardWithProgess
                    title="HIPPA"
                    compliancePercentage={90}
                    implemented={68}
                    totalControls={75}
                    progressColor = "bg-green-500"
                />
                <CardWithProgess
                    title="PCI DSS"
                    compliancePercentage={95}
                    implemented={74}
                    totalControls={78}
                    progressColor = "bg-slate-300"
                />
            </div>
        </>
    )
}    
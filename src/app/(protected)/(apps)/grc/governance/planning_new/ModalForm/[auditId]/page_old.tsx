"use client";
import { useState } from "react";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/shadcn/ui/table";
import { Dialog, DialogTrigger, DialogContent } from "@/shadcn/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shadcn/ui/select";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";

// Demo Data
const audit = {
  id: "iso-27001-2025",
  name: "ISO 27001:2022 Compliance Audit (2025)",
  organization: "ABC Corp",
  type: "ISO 27001",
  lead: "Maria Auditore",
  status: "Fieldwork",
  due: "2025-09-15",
  description: "Annual ISO 27001 compliance covering top control domains and objectives for ABC Corp.",
};

const initialPolicies = [
  { id: "A.5", name: "A.5 - Information Security Policies", owner: "Lisa IT", weightage: 40 },
  { id: "A.9", name: "A.9 - Access Control", owner: "Shyam Ops", weightage: 60 },
];

// Replace initialObjectives to add structured findings for the enhanced form
const initialObjectives = [
  {
    id: "A.9.2",
    policyId: "A.9",
    name: "A.9.2 User Access Management",
    owner: "Tom Admin",
    weightage: 50,
    status: "Fail", // Pass or Fail
    findings: [
      {
        observation: "Shared admin accounts in use",
        recommendations: [
          {
            recommendation: "Migrate to individual named accounts",
            actions: [
              { text: "Create unique logins", owner: "Shyam", due: "2024-07-30", status: "Open" },
              { text: "Disable shared accounts", owner: "Lisa", due: "2024-07-31", status: "Open" }
            ]
          }
        ]
      },
      {
        observation: "No access review process documented",
        recommendations: [
          {
            recommendation: "Establish quarterly access review process",
            actions: [
              { text: "Draft policy", owner: "Tom", due: "2024-07-12", status: "Closed" },
              { text: "Schedule first review", owner: "Tom", due: "2024-07-20", status: "Open" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "A.9.1", policyId: "A.9", name: "A.9.1 Access Control Policy", owner: "Shyam Ops", weightage: 50, status: "Pass", findings: []
  },
  {
    id: "A.5.1", policyId: "A.5", name: "A.5.1 Information Security Policy", owner: "Lisa IT", weightage: 60, status: "Pass", findings: []
  },
  {
    id: "A.5.2", policyId: "A.5", name: "A.5.2 Management Direction for InfoSec", owner: "Lisa IT", weightage: 40, status: "Pass", findings: []
  },
];

const initialEvidence = [
  { objId: "A.5.1", file: "sec_policy2025.pdf", status: "Accepted" },
  { objId: "A.5.2", file: "mgmt_direction_notes.pdf", status: "Accepted" },
  { objId: "A.9.1", file: "access_policy_Q1.pdf", status: "Accepted" },
  { objId: "A.9.2", file: "user_access_reviews.xlsx", status: "Pending" },
];

const initialFindings = [
  {
    id: "f1",
    objId: "A.9.2",
    summary: "Inconsistent user offboarding process detected.",
    remedies: [
      { text: "Automate offboarding via HRIS integration", owner: "Tom Admin", status: "Completed" },
      { text: "Quarterly access review for shared accounts", owner: "Shyam Ops", status: "Not Completed" }
    ],
  },
  {
    id: "f2",
    objId: "A.5.2",
    summary: "InfoSec policy not updated in 12 months.",
    remedies: [
      { text: "Schedule annual policy review meeting", owner: "Lisa IT", status: "Completed" },
      { text: "Send update reminders to policy owners", owner: "Lisa IT", status: "Completed" }
    ],
  },
];

const allEvidenceStatuses = ["Accepted", "Pending", "Needs Update", "Rejected"];

const allRemedyStatuses = ["Completed", "Not Completed"];

const tabList = ["Policies", "Objectives", "Evidence", "Findings"];

// Helper: returns true if all actions in all findings are Closed
function allRemediesClosed(findings) {
  if (!findings) return true;
  for (const obs of findings) {
    for (const rec of obs.recommendations) {
      for (const act of rec.actions) {
        if (act.status !== "Closed") return false;
      }
    }
  }
  return true;
}

function checkObjectiveComplete(obj, evidence, findings) {
  const e = evidence.find(ev => ev.objId === obj.id && ev.status === "Accepted");
  const objFindings = findings.filter(f => f.objId === obj.id);
  // All findings must have all remedies completed
  const allRemediesComplete = objFindings.every(f => f.remedies.length > 0 && f.remedies.every(r => r.status === "Completed"));
  return !!e && allRemediesComplete;
}

function calculatePolicyProgress(policy, objectives, evidence, findings) {
  const objectiveList = objectives.filter(o => o.policyId === policy.id);
  const totalWeight = objectiveList.reduce((sum, o) => sum + o.weightage, 0);
  const completedWeight = objectiveList.reduce((sum, o) => checkObjectiveComplete(o, evidence, findings) ? sum + o.weightage : sum, 0);
  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
}

function calculateAuditProgress(policies, objectives, evidence, findings) {
  const totalWeight = policies.reduce((w, p) => w + p.weightage, 0);
  const completedWeight = policies.reduce((w, p) => {
    const prog = calculatePolicyProgress(p, objectives, evidence, findings);
    return w + (p.weightage * (prog/100));
  }, 0);
  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
}

export default function AuditDetailPage() {
  const [activeTab, setActiveTab] = useState("Policies");
  const [policies, setPolicies] = useState(initialPolicies);
  const [objectives, setObjectives] = useState(initialObjectives);
  const [evidence, setEvidence] = useState(initialEvidence);
  const [findings, setFindings] = useState(initialFindings);
  const [editPolicy, setEditPolicy] = useState(null);
  const [editObjective, setEditObjective] = useState(null);
  const [editEvidence, setEditEvidence] = useState(null);
  const [editFinding, setEditFinding] = useState(null);
  const [addRemedyObj, setAddRemedyObj] = useState(null);
  const [newRemedy, setNewRemedy] = useState({ text: "", owner: "", status: "Not Completed" });
  const [editObjectiveAudit, setEditObjectiveAudit] = useState(null as null | { id: string });

  const auditProgress = calculateAuditProgress(policies, objectives, evidence, findings);
  const canClose =
    auditProgress === 100 &&
    policies.reduce((sum, p) => sum + p.weightage, 0) === 100 &&
    policies.every(p => {
      const objSum = objectives.filter(o => o.policyId === p.id).reduce((s, o) => s + o.weightage, 0);
      return objSum === 100;
    });

  return (
    <div>
      <div className="mb-3">
        <h2 className="text-2xl font-bold mb-2">{audit.name}</h2>
        <div className="mb-2 text-muted-foreground">{audit.organization} | Lead: {audit.lead} | Status: {audit.status} | Due: {audit.due}</div>
        <div className="italic mb-2">{audit.description}</div>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 h-2 rounded bg-muted relative overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${auditProgress}%` }} />
          </div>
          <span className="text-sm font-medium">{auditProgress}% Complete</span>
        </div>
        <Button disabled={!canClose} variant={canClose ? "default" : "outline"} className="mt-1">{canClose ? "Close Audit" : "Close Audit (all must be 100%)"}</Button>
      </div>
      <div className="flex gap-4 mb-8">
        {tabList.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-md font-medium transition border-b-2 ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`}>{tab}</button>
        ))}
      </div>

      {/* -- POLICIES TAB -- */}
      {activeTab === "Policies" && (
        <div>
          <Table><TableHeader><TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Policy/Clause</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Weightage</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Progress</TableHead>
          </TableRow></TableHeader><TableBody>
            {policies.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.owner}</TableCell>
                <TableCell>{p.weightage}</TableCell>
                <TableCell>
                  <Dialog open={editPolicy?.id === p.id} onOpenChange={open => !open && setEditPolicy(null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setEditPolicy({ ...p })}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="font-bold mb-2">Edit Policy</div>
                      <Input value={editPolicy?.name || ""} onChange={e => setEditPolicy(editPolicy ? { ...editPolicy, name: e.target.value } : null)} className="mb-2" />
                      <Input value={editPolicy?.owner || ""} onChange={e => setEditPolicy(editPolicy ? { ...editPolicy, owner: e.target.value } : null)} className="mb-2" placeholder="Owner" />
                      <Input type="number" min={0} max={100} value={editPolicy?.weightage ?? ""} onChange={e => setEditPolicy(editPolicy ? { ...editPolicy, weightage: Number(e.target.value) } : null)} className="mb-2" />
                      <Button size="sm" onClick={() => { setPolicies(pls => pls.map(pl => pl.id === p.id ? { ...editPolicy } : pl)); setEditPolicy(null); }}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditPolicy(null)}>Cancel</Button>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <div className="h-2 rounded-full w-28 bg-muted inline-block">
                    <span className="block h-2 bg-primary rounded-full" style={{ width: calculatePolicyProgress(p, objectives, evidence, findings) + "%" }}></span>
                  </div>
                  <span className="ml-2 text-xs text-muted-foreground">{calculatePolicyProgress(p, objectives, evidence, findings)}%</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody></Table>
          <div className="mt-2 text-xs text-muted-foreground">All Policy weights must sum to 100 for audit completion.</div>
        </div>
      )}

      {/* -- OBJECTIVES TAB -- */}
      {activeTab === "Objectives" && (
        <div>
          <Table><TableHeader><TableRow>
            <TableHead>Objective</TableHead><TableHead>Policy</TableHead>
            <TableHead>Owner</TableHead><TableHead>Weightage</TableHead>
            <TableHead>Status</TableHead><TableHead>Audit/Edit</TableHead>
            <TableHead>Complete?</TableHead>
          </TableRow></TableHeader><TableBody>
            {objectives.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.name}</TableCell>
                <TableCell>{policies.find(p => p.id === o.policyId)?.name}</TableCell>
                <TableCell>{o.owner}</TableCell>
                <TableCell>{o.weightage}</TableCell>
                <TableCell>
                  {o.status === "Pass" ? <span className="text-green-600 font-bold">Pass</span> : <span className="text-red-600 font-bold">Fail</span>}
                </TableCell>
                <TableCell>
                  <Dialog open={editObjectiveAudit?.id === o.id} onOpenChange={open => !open && setEditObjectiveAudit(null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setEditObjectiveAudit({ id: o.id })}>Audit/Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      {/* Audit form dialog for objective */}
                      <ObjectiveAuditDialogContent
                        objective={o}
                        updateObjective={updated => setObjectives(prev => prev.map(obj => obj.id === updated.id ? updated : obj))}
                      />
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  {o.status === "Pass" && allRemediesClosed(o.findings) ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-red-600 font-bold">No</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody></Table>
          <div className="mt-2 text-xs text-muted-foreground">Auditor can mark as Pass only after all remedies/actions are Closed.</div>
        </div>
      )}

      {/* -- EVIDENCE TAB -- */}
      {activeTab === "Evidence" && (
        <div>
          <Table><TableHeader><TableRow>
            <TableHead>Objective</TableHead><TableHead>Evidence File</TableHead>
            <TableHead>Status</TableHead><TableHead>Edit</TableHead>
          </TableRow></TableHeader><TableBody>
            {objectives.map((o) => {
              const ev = evidence.find(e => e.objId === o.id) || { file: "N/A", status: "Pending" };
              return (
                <TableRow key={o.id}>
                  <TableCell>{o.name}</TableCell>
                  <TableCell>{ev.file}</TableCell>
                  <TableCell>{ev.status}</TableCell>
                  <TableCell>
                    <Dialog open={editEvidence?.objId === o.id} onOpenChange={open => !open && setEditEvidence(null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setEditEvidence({ ...ev, objId: o.id })}>Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <div className="font-bold mb-2">Edit Evidence</div>
                        <Input value={editEvidence?.file || ""} onChange={e => setEditEvidence(editEvidence ? { ...editEvidence, file: e.target.value } : null)} className="mb-2" />
                        <Select value={editEvidence?.status || "Pending"} onValueChange={v => setEditEvidence(editEvidence ? { ...editEvidence, status: v } : null)}>
                          <SelectTrigger className="mb-2 w-full"><SelectValue placeholder="Status" /></SelectTrigger>
                          <SelectContent>{allEvidenceStatuses.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                        </Select>
                        <Button size="sm" onClick={() => { setEvidence(evArr => evArr.map(evObj => evObj.objId === o.id ? { ...editEvidence } : evObj)); setEditEvidence(null); }}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditEvidence(null)}>Cancel</Button>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody></Table>
        </div>
      )}

      {/* -- FINDINGS TAB -- */}
      {activeTab === "Findings" && (
        <div>
          <Table><TableHeader><TableRow>
            <TableHead>Objective</TableHead><TableHead>Summary</TableHead><TableHead>Remedies/Actions & Owner</TableHead>
            <TableHead>Edit Remedies</TableHead>
          </TableRow></TableHeader><TableBody>
            {findings.map((f) => {
              const obj = objectives.find(o => o.id === f.objId);
              return (
                <TableRow key={f.id}>
                  <TableCell>{obj ? obj.name : f.objId}</TableCell>
                  <TableCell>{f.summary}</TableCell>
                  <TableCell>
                    <ul className="space-y-1">
                      {f.remedies.map((r, i) => (
                        <li key={i} className="flex items-center gap-2">
                          {r.status === "Completed" ? <span className="inline-block w-3 h-3 bg-green-500 rounded-full" /> : <span className="inline-block w-3 h-3 bg-red-500 rounded-full" />}
                          <span>{r.text}</span>
                          <span className="italic text-xs text-muted-foreground">(Owner: {r.owner})</span>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <Dialog open={editFinding === f.id} onOpenChange={open => !open && setEditFinding(null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setEditFinding(f.id)}>Edit Remedies</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-full">
                        <div className="font-bold mb-2">Remedies / Actions</div>
                        <ul className="space-y-2 mb-2">
                          {f.remedies.map((r, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <Input value={r.text} className="w-1/3" onChange={e => setFindings(arr => arr.map(ff => ff.id === f.id ? { ...ff, remedies: ff.remedies.map((_r, idx) => idx === j ? { ..._r, text: e.target.value } : _r) } : ff))} />
                              <Input value={r.owner} className="w-1/4" placeholder="Owner" onChange={e => setFindings(arr => arr.map(ff => ff.id === f.id ? { ...ff, remedies: ff.remedies.map((_r, idx) => idx === j ? { ..._r, owner: e.target.value } : _r) } : ff))} />
                              <Select value={r.status} onValueChange={v => setFindings(arr => arr.map(ff => ff.id === f.id ? { ...ff, remedies: ff.remedies.map((_r, idx) => idx === j ? { ..._r, status: v } : _r) } : ff))}>
                                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                <SelectContent>{allRemedyStatuses.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                              </Select>
                              <Button size="icon" variant="outline" onClick={() => setFindings(arr => arr.map(ff => ff.id === f.id ? { ...ff, remedies: ff.remedies.filter((_r, idx) => idx !== j) } : ff))}>✕</Button>
                            </li>
                          ))}
                        </ul>
                        <div className="font-semibold mt-3">Add New Remedy/Action</div>
                        <div className="flex gap-2 items-center mt-1 mb-2">
                          <Input value={newRemedy.text} placeholder="Remedy / Action" className="w-1/2" onChange={e => setNewRemedy(nr => ({ ...nr, text: e.target.value }))} />
                          <Input value={newRemedy.owner} placeholder="Owner" className="w-24" onChange={e => setNewRemedy(nr => ({ ...nr, owner: e.target.value }))} />
                          <Select value={newRemedy.status} onValueChange={v => setNewRemedy(nr => ({ ...nr, status: v }))}>
                            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                            <SelectContent>{allRemedyStatuses.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                          </Select>
                          <Button size="sm" onClick={() => {
                            if (!newRemedy.text || !newRemedy.owner) return;
                            setFindings(arr => arr.map(ff => ff.id === f.id ? { ...ff, remedies: [...ff.remedies, newRemedy] } : ff));
                            setNewRemedy({ text: "", owner: "", status: "Not Completed" });
                          }}>Add</Button>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setEditFinding(null)}>Done</Button>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody></Table>
        </div>
      )}
    </div>
  );
}

// Add below main function in the file
function ObjectiveAuditDialogContent({ objective, updateObjective }) {
  const [local, setLocal] = useState(JSON.parse(JSON.stringify(objective)));
  // status, findings within local

  function setStatus(v) { setLocal({ ...local, status: v }); }
  function addObservation() { setLocal({ ...local, findings: [...(local.findings || []), { observation: "", recommendations: [] }] }); }
  function updateObservation(idx, obs) { setLocal({ ...local, findings: local.findings.map((o, i) => i === idx ? obs : o) }); }
  function removeObservation(idx) { setLocal({ ...local, findings: local.findings.filter((_, i) => i !== idx) }); }

  function canMarkPass() {
    return local.status === "Fail" ? allRemediesClosed(local.findings) : true;
  }

  function submit() {
    // Can't mark as Pass unless all remedies closed
    if (local.status === "Pass" && !allRemediesClosed(local.findings)) {
      alert("All actions for findings must be Closed to mark objective as Pass.");
      return;
    }
    updateObjective(local);
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Audit Control Objective</label>
      <div className="mb-3 mt-1 text-lg font-bold">{local.name}</div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Status</label>
        <Select value={local.status} onValueChange={setStatus}>
          <SelectTrigger className="w-40 mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Pass">Pass</SelectItem>
            <SelectItem value="Fail">Fail</SelectItem>
          </SelectContent>
        </Select>
        {local.status === "Pass" && !allRemediesClosed(local.findings) && (
          <div className="text-xs text-red-500 mt-1">All remedies/actions must be Closed first!</div>
        )}
      </div>

      {local.status === "Fail" && (
        <div className="bg-muted px-3 py-2 rounded">
          <div className="font-semibold mb-1">Observations</div>
          {(local.findings || []).map((obs, i) => (
            <div key={i} className="bg-white p-3 rounded mb-3 border">
              <div className="flex justify-between items-center">
                <Input
                  value={obs.observation}
                  onChange={e => updateObservation(i, { ...obs, observation: e.target.value })}
                  placeholder="Observation (required)"
                  className="w-3/5"
                />
                <Button size="sm" variant="outline" onClick={() => removeObservation(i)}>Remove</Button>
              </div>
              {/* Recommendations */}
              <div className="mt-2">
                <label className="block text-sm font-medium">Recommendations</label>
                {(obs.recommendations || []).map((rec, ri) => (
                  <div key={ri} className="bg-muted mt-1 p-2 rounded">
                    <Input
                      value={rec.recommendation}
                      onChange={e => {
                        const recs = obs.recommendations.map((r, rri) => rri === ri ? { ...r, recommendation: e.target.value } : r);
                        updateObservation(i, { ...obs, recommendations: recs });
                      }}
                      placeholder="Recommendation (required)"
                      className="mb-1"
                    />
                    <label className="block text-sm font-medium">Actions/Remedies</label>
                    {(rec.actions || []).map((act, ai) => (
                      <div key={ai} className="flex gap-2 mb-1 items-end">
                        <Input value={act.text} onChange={e => {
                          const acts = rec.actions.map((a, aj) => aj === ai ? { ...a, text: e.target.value } : a);
                          const recs = obs.recommendations.map((r, rri) => rri === ri ? { ...r, actions: acts } : r);
                          updateObservation(i, { ...obs, recommendations: recs });
                        }} placeholder="Action/Remedy" className="w-1/3" />
                        <Input value={act.owner} onChange={e => {
                          const acts = rec.actions.map((a, aj) => aj === ai ? { ...a, owner: e.target.value } : a);
                          const recs = obs.recommendations.map((r, rri) => rri === ri ? { ...r, actions: acts } : r);
                          updateObservation(i, { ...obs, recommendations: recs });
                        }} placeholder="Owner" className="w-1/5" />
                        <Input type="date" value={act.due} onChange={e => {
                          const acts = rec.actions.map((a, aj) => aj === ai ? { ...a, due: e.target.value } : a);
                          const recs = obs.recommendations.map((r, rri) => rri === ri ? { ...r, actions: acts } : r);
                          updateObservation(i, { ...obs, recommendations: recs });
                        }} className="w-32" />
                        <Select value={act.status} onValueChange={v => {
                          const acts = rec.actions.map((a, aj) => aj === ai ? { ...a, status: v } : a);
                          const recs = obs.recommendations.map((r, rri) => rri === ri ? { ...r, actions: acts } : r);
                          updateObservation(i, { ...obs, recommendations: recs });
                        }}>
                          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="icon" variant="outline" onClick={() => {
                          const acts = rec.actions.filter((_, aj) => aj !== ai);
                          const recs = obs.recommendations.map((r, rri) => rri === ri ? { ...r, actions: acts } : r);
                          updateObservation(i, { ...obs, recommendations: recs });
                        }}>✕</Button>
                      </div>
                    ))}
                    <Button size="sm" className="mt-1 mb-1" onClick={() => {
                      const recs = obs.recommendations.map((r, rri) => rri === ri ? { ...r, actions: [...(r.actions || []), { text: "", owner: "", due: "", status: "Open" }] } : r);
                      updateObservation(i, { ...obs, recommendations: recs });
                    }}>Add Action/Remedy</Button>
                  </div>
                ))}
                <Button size="sm" className="mt-1" onClick={() => {
                  updateObservation(i, { ...obs, recommendations: [...(obs.recommendations || []), { recommendation: "", actions: [] }] });
                }}>Add Recommendation</Button>
              </div>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={addObservation}>Add Observation</Button>
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <Button size="sm" onClick={submit}>Save</Button>
        <Button size="sm" variant="outline" onClick={() => updateObjective(objective)}>Cancel</Button>
      </div>
    </div>
  );
}

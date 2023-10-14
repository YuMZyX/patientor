import { useParams } from "react-router-dom";
import { DiagnoseCode, Diagnosis, Entry, Patient } from "../../types";
import TransgenderIcon from '@mui/icons-material/Transgender';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useState, useEffect } from "react";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import HealthCheckEntryC from "./HealthCheckEntry";
import HospitalEntryC from "./HospitalEntry";
import OccupationalHealthcareEntryC from "./OccupationalHealthCareEntry";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const id = useParams().id;
  
  useEffect(() => {
    const fetchPatient = async () => {
      if (id !== undefined) {
        const patient = await patientService.get(id);
        setPatient(patient);
      } else {
        throw new Error('Cannot find patient id');
      }
    };
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosisService.getAll();
      setDiagnoses(diagnoses);
    };
    void fetchPatient();
    void fetchDiagnoses();
  }, [id]);

  let codes: DiagnoseCode[] = [];

  patient?.entries.map((entry: Entry) => {
    if (entry.diagnosisCodes !== undefined) {
      codes = entry.diagnosisCodes.map((code: string) => {
        return { code: code };
      });
    }
  });
  const filteredDiagnoseCodes = diagnoses.filter(d1 => codes.some(d2 => d1.code === d2.code));

  const genderIcon = (patient: Patient) => {
    if (patient.gender === 'male') {
      return <MaleIcon></MaleIcon>;
    } else if (patient.gender === 'female') {
      return <FemaleIcon></FemaleIcon>;
    } else if (patient.gender === 'other') {
      return <TransgenderIcon></TransgenderIcon>;
    } else {
      return null;
    }
  };

  if (!patient) {
    return null;
  }
  return (
    <div>
      <h2>{patient.name} {genderIcon(patient)}</h2>
      <span>ssn: {patient.ssn}</span><br />
      <span>occupation: {patient.occupation}</span>
      {patient.entries.length > 0 ? <h4>Entries:</h4> : <div></div>}
      {patient.entries.map((entry: Entry) => 
        <EntryDetails key={entry.id} entry={entry} diagnoses={filteredDiagnoseCodes} />
      )}
    </div>
  );
};

export default PatientPage;

const EntryDetails: React.FC<{ entry: Entry, diagnoses: Diagnosis[] }> = ({ entry, diagnoses }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEntryC entry={entry} diagnoses={diagnoses} />;
    case "Hospital":
      return <HospitalEntryC entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryC entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};
import { useParams } from 'react-router-dom';
import { Diagnosis, Entry, Gender, Patient } from '../../types';
import TransgenderIcon from '@mui/icons-material/Transgender';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useState, useEffect } from 'react';
import patientService from '../../services/patients';
import diagnosisService from '../../services/diagnoses';
import HealthCheckEntryC from './HealthCheckEntry';
import HospitalEntryC from './HospitalEntry';
import OccupationalHealthcareEntryC from './OccupationalHealthCareEntry';
import { FormControl, Select, MenuItem, InputLabel, SelectChangeEvent } from '@mui/material';
import HealthCheckForm from './HealthCheckForm';
import HospitalForm from './HospitalForm';
import OccupationalHealthCareForm from './OccupationalHealthCareForm';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>({
    id: '',
    name: '',
    occupation: '',
    ssn: '',
    gender: Gender.Other,
    entries: []
  });
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [entryForm, setEntryForm] = useState('');
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
  }, [id, entryForm]);

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

  const handleChange = (event: SelectChangeEvent) => {
    setEntryForm(event.target.value);
  };

  if (!patient) {
    return null;
  }
  return (
    <div>
      <h2>{patient.name} {genderIcon(patient)}</h2>
      <span>ssn: {patient.ssn}</span><br />
      <span>occupation: {patient.occupation}</span><br />
      <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
        <InputLabel id="demo-select-small-label">New entry</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="entryFormSelect"
          value={entryForm}
          label="New entry"
          onChange={handleChange}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'HealthCheck'}>Health check entry</MenuItem>
          <MenuItem value={'Hospital'}>Hospital entry</MenuItem>
          <MenuItem value={'OccupationalHealthcare'}>Occupation health care entry</MenuItem>
        </Select>
      </FormControl>
      <EntryForm entryForm={entryForm} diagnoses={diagnoses} patient={patient} setPatient={setPatient} setEntryForm={setEntryForm} />
      {patient.entries.length > 0 ? <h4>Entries:</h4> : <div></div>}
      {patient.entries.map((entry: Entry) => 
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      )}
    </div>
  );
};

export default PatientPage;

const EntryDetails: React.FC<{ entry: Entry, diagnoses: Diagnosis[] }> = ({ entry, diagnoses }) => {
  switch (entry.type) {
    case 'HealthCheck':
      return <HealthCheckEntryC entry={entry} diagnoses={diagnoses} />;
    case 'Hospital':
      return <HospitalEntryC entry={entry} diagnoses={diagnoses} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntryC entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

const EntryForm: React.FC<{ entryForm: string, diagnoses: Diagnosis[], patient: Patient, 
  setPatient: React.Dispatch<React.SetStateAction<Patient>>, setEntryForm: React.Dispatch<React.SetStateAction<string>> 
  }> = ({ entryForm, diagnoses, patient, setPatient, setEntryForm }) => {
  switch (entryForm) {
    case 'HealthCheck':
      return <HealthCheckForm diagnoses={diagnoses} patient={patient} setPatient={setPatient} setEntryForm={setEntryForm} />;
    case 'Hospital':
      return <HospitalForm diagnoses={diagnoses} patient={patient} setPatient={setPatient} setEntryForm={setEntryForm} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthCareForm diagnoses={diagnoses} patient={patient} setPatient={setPatient} setEntryForm={setEntryForm} />;
      case '':
        return <div></div>;
    default:
      return <div></div>;
  }
};
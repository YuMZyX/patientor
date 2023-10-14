import { useParams } from "react-router-dom";
import { Patient } from "../../types";
import TransgenderIcon from '@mui/icons-material/Transgender';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useState, useEffect } from "react";
import patientService from "../../services/patients";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
  const id = useParams().id;
  
  useEffect(() => {
    const fetchPatient = async () => {
      if (id !== undefined) {
        const patient = await patientService.get(id);
        setPatient(patient);
      }
    };
    void fetchPatient();
  }, [id]);

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
    </div>
  );
};

export default PatientPage;
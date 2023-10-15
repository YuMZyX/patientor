import { Diagnosis, HospitalEntry, DiagnoseCode } from '../../types';
import { List, ListItem, Box } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

interface Props {
  entry : HospitalEntry
  diagnoses: Diagnosis[]
}

const HospitalEntryC = ({ entry, diagnoses } : Props ) => {

  let codes: DiagnoseCode[] = [];
  if (entry.diagnosisCodes !== undefined) {
    codes = entry.diagnosisCodes.map((code: string) => {
      return { code: code };
    });
  }
  const filteredDiagnoseCodes = diagnoses.filter(d1 => codes.some(d2 => d1.code === d2.code));

  const diagnoseList = () => {
    if (filteredDiagnoseCodes != null && filteredDiagnoseCodes.length > 0) {
      return (
        <ListItem>
          <ul>
            {filteredDiagnoseCodes.map((d: Diagnosis) => 
              <li key={d.code}>{d.code} {d.name}</li>
            )}
          </ul>
        </ListItem>
      );
    }
  };
  
  const commonStyles = {
    bgcolor: 'background.paper',
    borderColor: 'text.primary',
    m: 2,
    border: 1,
  };

  return (
    <Box sx={{ ...commonStyles, borderRadius: '16px' }}>
      <List>
        <ListItem>
          {entry.date} &nbsp; <LocalHospitalIcon></LocalHospitalIcon><br />
        </ListItem>
        <ListItem>
          {entry.description}
        </ListItem>
        {diagnoseList()}
        <ListItem>
          Discharge date: {entry.discharge.date} - {entry.discharge.criteria}
        </ListItem>
        <ListItem>
          Diagnose by {entry.specialist}
        </ListItem>
      </List>
    </Box>
  );
};

export default HospitalEntryC;
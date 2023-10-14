import { Diagnosis, OccupationalHealthcareEntry } from "../../types";
import { List, ListItem, Box } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

interface Props {
  entry : OccupationalHealthcareEntry
  diagnoses: Diagnosis[]
}

const OccupationalHealthcareEntryC = ({ entry, diagnoses } : Props ) => {

  const diagnoseList = () => {
    if (diagnoses != null && diagnoses.length > 0) {
      return (
        <ListItem>
          <ul>
            {diagnoses.map((d: Diagnosis) => 
              <li key={d.code}>{d.code} {d.name}</li>
            )}
          </ul>
        </ListItem>
      );
    }
  };

  const sickLeave = () => {
    if (entry.sickLeave?.endDate && entry.sickLeave.startDate) {
      return (
        <ListItem>
          Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </ListItem>
      );
    }
  };
  
  const commonStyles = {
    bgcolor: 'background.paper',
    borderColor: 'text.primary',
    m: 1,
    border: 1,
  };

  return (
    <Box sx={{ ...commonStyles, borderRadius: '16px' }}>
      <List>
        <ListItem>
          {entry.date} &nbsp; <WorkIcon></WorkIcon> &nbsp; {entry.employerName}
        </ListItem>
        <ListItem>
          {entry.description}
        </ListItem>
        {diagnoseList()}
        {sickLeave()}
        <ListItem>
          Diagnose by {entry.specialist}
        </ListItem>
      </List>
    </Box>
  );
};

export default OccupationalHealthcareEntryC;
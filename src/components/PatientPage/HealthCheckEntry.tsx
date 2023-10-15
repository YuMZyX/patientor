import { Diagnosis, HealthCheckEntry, DiagnoseCode } from '../../types';
import { List, ListItem, Box } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';


interface Props {
  entry : HealthCheckEntry
  diagnoses: Diagnosis[]
}

const HealthCheckEntryC = ({ entry, diagnoses } : Props ) => {

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

  const heartIcon = () => {
    switch (entry.healthCheckRating) {
      case 0:
        return <FavoriteIcon sx={{ color: 'green' }}></FavoriteIcon>;
      case 1:
        return <FavoriteIcon sx={{ color: 'yellow' }}></FavoriteIcon>;
      case 2:
        return <FavoriteIcon sx={{ color: 'orange' }}></FavoriteIcon>;
      case 3:
        return <FavoriteIcon sx={{ color: 'red' }}></FavoriteIcon>;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ ...commonStyles, borderRadius: '16px' }}>
      <List>
        <ListItem>
          {entry.date} &nbsp; <MedicalServicesIcon></MedicalServicesIcon><br />
        </ListItem>
        <ListItem>
          {entry.description}
        </ListItem>
        <ListItem>
          {heartIcon()}
        </ListItem>
        {diagnoseList()}
        <ListItem>
          Diagnose by {entry.specialist}
        </ListItem>
      </List>
    </Box>
  );
};

export default HealthCheckEntryC;
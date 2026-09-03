import { useSelector } from 'react-redux';

// Inside your DocumentList component:
const { role } = useSelector((state) => state.auth);

// Render the button EXACTLY like this:
{(role === 'CONTENT_CREATOR' || role === 'PROJECT_DIRECTOR') && (
  <button onClick={() => {/* Open Modal Logic */}}>
    + New Document
  </button>
)}
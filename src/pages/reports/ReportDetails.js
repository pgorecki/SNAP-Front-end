import React, { useContext, useEffect } from 'react';
import renderHTML from 'react-render-html';
import { AppContext } from 'AppStore';
import DetailsPage from '../DetailsPage';

const snippet = `
<div class='tableauPlaceholder' style='width: 1000px; height: 1027px;'><object class='tableauViz' width='1000' height='1027' style='display:none;'><param name='host_url' value='https%3A%2F%2F10ay.online.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='&#47;t&#47;communitytechnologyalliance' /><param name='name' value='ReverseReferralLog&#47;ReverseReferralLog' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='showAppBanner' value='false' /></object></div>
`;

export default function ReportDetails() {
  const [{ user }] = useContext(AppContext);

  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://10ay.online.tableau.com/javascripts/api/viz_v1.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return <DetailsPage title={`Reports`}>{renderHTML(snippet)}</DetailsPage>;
}

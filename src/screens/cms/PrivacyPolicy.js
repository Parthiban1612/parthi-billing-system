import React from 'react'
import CMSContent from './CMSContent'
import useFetch from '../../hooks/useFetch'
import { ENDPOINTS } from '../../redux/endpoints'

const PrivacyPolicy = () => {

  const { data: privacyPolicy, loading } = useFetch({
    url: ENDPOINTS.PRIVACY_POLICY,
    method: 'GET',
  });

  return <CMSContent
    loading={loading}
    title="Privacy Policy"
    html={privacyPolicy?.data?.content}
  />

}

export default PrivacyPolicy;



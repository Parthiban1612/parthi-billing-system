import React from 'react'
import { ENDPOINTS } from '../../redux/endpoints'
import CMSContent from './CMSContent'
import useFetch from '../../hooks/useFetch'

const RefundAndCancellation = () => {

  const { data, loading } = useFetch({
    url: ENDPOINTS.REFUND_AND_CANCELLATION,
    method: 'GET',
  });

  return <CMSContent
    loading={loading}
    title="Refund and Cancellation"
    html={data?.data?.content}
  />
}

export default RefundAndCancellation;

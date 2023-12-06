export const addBtrPayFees = async () => {
  const payFeesWidget = usePayFeesWidget()

  const feeInfo = await payFeesWidget.getFeeInfo(
    {
      entityType: 'BTR',
      filingTypeCode: 'REGSIGIN',
      futureEffective: false,
      priority: false,
      waiveFees: false
    }
  )

  return payFeesWidget.addFee(feeInfo)
}

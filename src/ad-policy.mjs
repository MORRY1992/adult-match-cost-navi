export function canLoadAd(config, context) {
  return Boolean(config.enabled===true && config.siteApproved===true && config.host && config.host===context.host && config.approvalRef && config.categoryApproved===true && config.japanAllowed===true && config.formatsApproved?.includes(config.format) && context.consent===true && context.adultAcknowledged===true && config.explicit!==true);
}

import { createMongoAbility } from '@casl/ability'
import { abilitiesPlugin } from '@casl/vue'

export default function (app) {
  const userAbilityRules =JSON.parse(localStorage.getItem('userAbilityRules'))//useCookie('userAbilityRules')
  const initialAbility = createMongoAbility(userAbilityRules ?? [])
  console.log('userAbilityRules === ', userAbilityRules)
  console.log('userAbilityRules cookie', useCookie('userAbilityRules'));
  app.use(abilitiesPlugin, initialAbility, {
    useGlobalProperties: true,
  })
}

<template>
  <div class="control-information">
    <div v-if="getSharesControlText(item)">
      <span class="font-bold italic">
        {{ $t('labels.shares') }}
      </span>
      <br>
      <img
        v-for="icon in convertDetailsToIcons(item)"
        :key="icon.src"
        :src="icon.src"
        :alt="icon.alt"
        class="inline-block mr-1"
      >
      <br>
      <div class="mt-2">
        {{ getSharesControlText(item) }}
      </div>
      <UAccordion
        v-if="sharesAccordionItems.length"
        multiple
        variant="ghost"
        class="my-2"
        :items="sharesAccordionItems"
      >
        <!-- eslint-disable-next-line -->
        <template #default="{ item, open }">
          <UButton :padded="false" variant="ghost">
            <template #leading>
              <UIcon
                name="i-heroicons-chevron-down-20-solid"
                class="transform transition-transform duration-200"
                :class="[open && 'rotate-180']"
              />
            </template>
            {{ item.label }}
          </UButton>
        </template>
        <!-- eslint-disable-next-line -->
        <template #item="{ item }">
          <!-- eslint-disable-next-line -->
          <span v-html="item.content" />
        </template>
      </UAccordion>
    </div>

    <div v-if="getVotesControlText(item)">
      <span class="font-bold italic">
        {{ $t('labels.votes') }}
      </span>
      <br>
      <img
        v-for="icon in convertDetailsToIcons(item, true)"
        :key="icon.src"
        :src="icon.src"
        :alt="icon.alt"
        class="inline-block mr-1"
      >
      <br>
      <div class="mt-2">
        {{ getVotesControlText(item) }}
      </div>
      <UAccordion
        v-if="votesAccordionItems.length"
        multiple
        variant="ghost"
        class="my-2"
        :items="votesAccordionItems"
      >
        <!-- eslint-disable-next-line -->
        <template #default="{ item, open }">
          <UButton :padded="false" variant="ghost">
            <template #leading>
              <UIcon
                name="i-heroicons-chevron-down-20-solid"
                class="transform transition-transform duration-200"
                :class="[open && 'rotate-180']"
              />
            </template>
            {{ item.label }}
          </UButton>
        </template>
        <!-- eslint-disable-next-line -->
        <template #item="{ item }">
          <!-- eslint-disable-next-line -->
          <span v-html="item.content" />
        </template>
      </UAccordion>
    </div>

    <div v-if="getDirectorsControlText(item.controlOfDirectors)">
      <span class="font-bold italic">
        {{ $t('labels.directors') }}
      </span>
      <br>
      <img
        v-for="icon in convertDetailsToIcons(item, false, true)"
        :key="icon.src"
        :src="icon.src"
        :alt="icon.alt"
        class="inline-block mr-1"
      >
      <br>
      <UAccordion
        v-if="directorsAccordionItems.length"
        multiple
        class="my-2"
        :items="directorsAccordionItems"
      >
        <!-- eslint-disable-next-line -->
        <template #default="{ item, open }">
          <UButton :padded="false" variant="ghost">
            <template #leading>
              <UIcon
                name="i-heroicons-chevron-down-20-solid"
                class="transform transition-transform duration-200"
                :class="[open && 'rotate-180']"
              />
            </template>
            {{ item.label }}
          </UButton>
        </template>
        <!-- eslint-disable-next-line -->
        <template #item="{ item }">
          <!-- eslint-disable-next-line -->
          <span v-html="item.content" />
        </template>
      </UAccordion>
    </div>

    <div v-if="item.controlOther" class="mt-3">
      <span class="font-bold italic">
        {{ $t('labels.other') }}
      </span>
      <p>{{ item.controlOther }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SiSchemaType, SiControlOfDirectorsSchemaType } from '~/utils/si-schema/definitions'
import SiSchemaToBtrBodsConverters from '~/utils/btr-bods/si-schema-to-btr-bods-converters'
import { PercentageRangeE } from '~/enums/percentage-range-e'
const t = useNuxtApp().$i18n.t

type IconType = { src: string; alt: string }

const prop = defineProps<{ item: SiSchemaType }>()
const interests = SiSchemaToBtrBodsConverters.getInterests(prop.item)

const INTERESTS_SHARES_JOINT = 'controlType.shares.actingJointly'
const INTERESTS_SHARES_CONCERT = 'controlType.shares.inConcertControl'
const INTERESTS_VOTES_JOINT = 'controlType.votes.actingJointly'
const INTERESTS_VOTES_CONCERT = 'controlType.votes.inConcertControl'
const INTERESTS_DIRECTORS_JOINT = 'controlType.directors.actingJointly'
const INTERESTS_DIRECTORS_CONCERT = 'controlType.directors.inConcertControl'

const sharesJointly = computed(() => {
  return interests.find(i => i.details === INTERESTS_SHARES_JOINT)?.connectedIndividuals || []
})

const sharesInConcert = computed(() => {
  return interests.find(i => i.details === INTERESTS_SHARES_CONCERT)?.connectedIndividuals || []
})

const votesJointly = computed(() => {
  return interests.find(i => i.details === INTERESTS_VOTES_JOINT)?.connectedIndividuals || []
})

const votesInConcert = computed(() => {
  return interests.find(i => i.details === INTERESTS_VOTES_CONCERT)?.connectedIndividuals || []
})

const directorsJointly = computed(() => {
  return interests.find(i => i.details === INTERESTS_DIRECTORS_JOINT)?.connectedIndividuals || []
})

const directorsInConcert = computed(() => {
  return interests.find(i => i.details === INTERESTS_DIRECTORS_CONCERT)?.connectedIndividuals || []
})

const sharesAccordionItems = computed(() => {
  const rv = []
  const jointly = sharesJointly
  const inconcert = sharesInConcert
  if (jointly.value.length > 0) {
    rv.push({
      label: `Acting jointly (${jointly.value.length + 1})`,
      content: prop.item.name.fullName + '<br>' + jointly.value.map(i => i.legalName).join('<br>'),
      padded: false
    })
  }

  if (inconcert.value.length > 0) {
    rv.push({
      label: `Acting in concert(${inconcert.value.length + 1})`,
      content: prop.item.name.fullName + '<br>' + inconcert.value.map(i => i.legalName).join('<br>'),
      padded: false
    })
  }
  return rv
})

const votesAccordionItems = computed(() => {
  const rv = []
  const jointly = votesJointly
  const inconcert = votesInConcert
  if (jointly.value.length > 0) {
    rv.push({
      label: `Acting jointly (${jointly.value.length + 1})`,
      content: prop.item.name.fullName + '<br>' + jointly.value.map(i => i.legalName).join('<br>'),
      padded: false
    })
  }

  if (inconcert.value.length > 0) {
    rv.push({
      label: `Acting in concert(${inconcert.value.length + 1})`,
      content: prop.item.name.fullName + '<br>' + inconcert.value.map(i => i.legalName).join('<br>'),
      padded: false
    })
  }
  return rv
})

const directorsAccordionItems = computed(() => {
  const rv = []
  const jointly = directorsJointly
  const inconcert = directorsInConcert

  if (jointly.value.length > 0) {
    rv.push({
      label: `Acting jointly (${jointly.value.length + 1})`,
      content: prop.item.name.fullName + '<br>' + jointly.value.map(i => i.legalName).join('<br>'),
      padded: false
    })
  }

  if (inconcert.value.length > 0) {
    rv.push({
      label: `Acting in concert(${inconcert.value.length + 1})`,
      content: prop.item.name.fullName + '<br>' + inconcert.value.map(i => i.legalName).join('<br>'),
      padded: false
    })
  }
  return rv
})

function getVotesControlText (si: SiSchemaType) {
  const field = getControlTextField([
    { value: si.controlOfVotes.registeredOwner, field: 'registered' },
    { value: si.controlOfVotes.beneficialOwner, field: 'beneficial' },
    { value: si.controlOfVotes.indirectControl, field: 'indirect' }
  ])

  const voteRanges: Map<PercentageRangeE, string> = new Map([
    [PercentageRangeE.MORE_THAN_75, t('texts.sharesAndVotes.percentageRange.moreThan75', { sharesOrVotes: 'votes' })],
    [PercentageRangeE.MORE_THAN_50_TO_75, t('texts.sharesAndVotes.percentageRange.moreThan50To75',
      { sharesOrVotes: 'votes' })],
    [PercentageRangeE.AT_LEAST_25_TO_50, t('texts.sharesAndVotes.percentageRange.atLeast25To50',
      { sharesOrVotes: 'votes' })],
    [PercentageRangeE.LESS_THAN_25, t('texts.sharesAndVotes.percentageRange.lessThan25', { sharesOrVotes: 'votes' })],
    [PercentageRangeE.NO_SELECTION, '']
  ])

  let votes: string = ''
  if (si.controlOfVotes.percentage) {
    votes += voteRanges.get(si.controlOfVotes.percentage)
  }
  if (field) {
    return votes
  }

  return ''
}

function getDirectorsControlText (controlOfDirectors: SiControlOfDirectorsSchemaType) {
  const field = getControlTextField([
    { value: controlOfDirectors.directControl, field: 'direct' },
    { value: controlOfDirectors.indirectControl, field: 'indirect' },
    { value: controlOfDirectors.significantInfluence, field: 'significantinfluence' }
  ])
  if (field) {
    return t(`texts.controlOfDirectors.summary.${field}`)
  }
  return ''
}

function getControlTextField (items: { value: boolean, field: string }[]) {
  const activeLabels = items.filter(item => item.value).map(item => item.field)
  return activeLabels.join('') || ''
}

function getSharesControlText (si: SiSchemaType) {
  const field = getControlTextField([
    { value: si.controlOfShares.registeredOwner || si.controlOfVotes.registeredOwner, field: 'registered' },
    { value: si.controlOfShares.beneficialOwner || si.controlOfVotes.beneficialOwner, field: 'beneficial' },
    { value: si.controlOfShares.indirectControl || si.controlOfVotes.indirectControl, field: 'indirect' }
  ])

  const shareRanges: Map<PercentageRangeE, string> = new Map([
    [PercentageRangeE.MORE_THAN_75, t('texts.sharesAndVotes.percentageRange.moreThan75', { sharesOrVotes: 'shares' })],
    [PercentageRangeE.MORE_THAN_50_TO_75, t('texts.sharesAndVotes.percentageRange.moreThan50To75',
      { sharesOrVotes: 'shares' })],
    [PercentageRangeE.AT_LEAST_25_TO_50, t('texts.sharesAndVotes.percentageRange.atLeast25To50',
      { sharesOrVotes: 'shares' })],
    [PercentageRangeE.LESS_THAN_25, t('texts.sharesAndVotes.percentageRange.lessThan25', { sharesOrVotes: 'shares' })],
    [PercentageRangeE.NO_SELECTION, '']
  ])

  let shares: string = ''
  if (si.controlOfShares.percentage) {
    shares = shareRanges.get(si.controlOfShares.percentage) || ''
  }

  if (field) {
    return shares
  }
  return ''
}

const convertDetailsToIcons = (details: SearchResultI, votes?: boolean, directors?: boolean): Array<IconType> => {
  if (typeof votes === 'undefined') {
    votes = false
  }

  if (typeof directors === 'undefined') {
    directors = false
  }
  const rv = []
  if (!directors) {
    const checkField = votes ? details.controlOfVotes : details.controlOfShares
    if (checkField.beneficialOwner) {
      rv.push({ src: '/icons/shares-votes/beneficial-owner.svg', alt: 'Beneficial owner' })
    }

    if (checkField.indirectControl) {
      rv.push({ src: '/icons/shares-votes/indirect-control.svg', alt: 'Indirect control' })
    }

    if (checkField.registeredOwner) {
      rv.push({ src: '/icons/shares-votes/registered-owner.svg', alt: 'Registered owner' })
    }
  }

  if (directors) {
    if (details.controlOfDirectors?.directControl) {
      rv.push({ src: '/icons/directors/direct-control.svg', alt: 'Direct control' })
    }

    if (details.controlOfDirectors?.indirectControl) {
      rv.push({ src: '/icons/directors/indirect-control.svg', alt: 'Indirect control' })
    }

    if (details.controlOfDirectors?.significantInfluence) {
      rv.push({ src: '/icons/directors/significant-influence.svg', alt: 'Significant influence' })
    }
  }

  if (rv.length === 0) {
    rv.push({ src: '/icons/other.svg', alt: 'Other' })
  }
  return rv
}
</script>

<style lang="scss" scoped>
.information > div:not(:first-child) {
  margin-top: 8px;
}
.information-icon {
  @apply mr-1 text-[20px]
}
</style>

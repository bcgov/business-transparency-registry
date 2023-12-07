
<template>
  <h2 class="font-bold text-lg mt-5" data-cy="review-confirm-section-heading">
    2. Certify
  </h2>
  <div class="mt-10 p-10 bg-white rounded flex" data-cy="effective-date-select">
    <label class="font-bold text-lg w-[200px]">Certification</label>
    <div class="ml-10 text-lg">
      <div>
        <UCheckbox>
          <template #label>
            <span class="text-sm">
              I, <span class="font-bold"> {{ name.toUpperCase() }}</span>, certify that I have relevant knowledge of this BC Benefit Company and that I am authorized to make this filing.
              <br/>
              Date: {{ date }} <br/>
              Note:It is an offence to make a false or misleading statement in respect of a material fact in a record submitted to the Corporate Registry for filing. 
              See section 427 of the Business Corporations Act.
            </span>
          </template>
        </UCheckbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  name: {type: String, required: true, default: 'name' },
  date: {type: String, required: true, default: 'date' }
})
</script>

<template>
  <va-card :title="`Log (${$route.params.cell})`">
    <va-button icon="fa fa-reply" flat slot="actions" class="mr-0" @click="goBack" />
    <vsa-list>
      <vsa-item v-for="(logTypeItem, $k) in log" :key="$k">
        <vsa-heading>{{ $k }}</vsa-heading>
        <vsa-content>
          <vsa-list>
            <vsa-item v-for="(logByHour, $hour) in logTypeItem" :key="`${$k}-${$hour}`">
              <vsa-heading>{{ `${$hour} (hour)` }}</vsa-heading>
              <vsa-content>
                <vsa-list>
                  <vsa-item v-for="(logByDate, $date) in logByHour" :key="`${$k}-${$hour}-${$date}`">
                    <vsa-heading>{{ $moment($date.replace(/\s/g, '.')).format('YYYY-MM-DD h:mm:ss') }}</vsa-heading>
                    <vsa-content>
                      <vue-json-pretty
                        :data="logByDate"
                        :showLine="false"
                        :showDoubleQuotes="false"
                        :deep="4"
                      ></vue-json-pretty>
                    </vsa-content>
                  </vsa-item>
                </vsa-list>
              </vsa-content>
            </vsa-item>
          </vsa-list>
        </vsa-content>
      </vsa-item>
    </vsa-list>
  </va-card>
</template>

<script>
import { database } from '@/services/firebase'

export default {
  name: 'LogItem',
  created() {
    const device = this.$route.params.device
    const date = this.$route.params.date.split('-')
    const cell = this.$route.params.cell
    this.logRef = database.ref(`logsV2/${device}/${date[0]}_${date[1]}/${date[2]}/${cell}`)
    this.logRef.once('value').then(this.logListener)
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'logs') {
      to.query.device = this.$route.params.device
      to.query.date = this.$route.params.date
    }
    next()
  },
  data: () => ({
    logRef: null,
    log: null,
  }),
  methods: {
    goBack() {
      this.$router.push({ name: 'logs' })
    },
    logListener(snapshot) {
      this.log = { ...snapshot.val() }
    },
  },
}
</script>

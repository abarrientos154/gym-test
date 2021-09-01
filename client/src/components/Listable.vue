<template>
  <div class="q-pa-md">
    <q-table
      :title="title"
      :data="data"
      :columns="columns"
      row-key="name"
      :no-data-label="`Aún no existen ${titles}`"
    >
      <q-td
          slot="body-cell-actions"
          slot-scope="props"
          :props="props"
          v-if="checkIfActions()"
        >
          <q-btn
            v-for="action in props.row.actions"
            :key="action.icon"
            :to="action.url"
            :icon="action.icon"
            @click="execute(props.row._id, action.title)"
            :color="action.color"
            size="sm"
            outline
            style="margin-right:4px"
          >
            <q-tooltip>
              {{action.title}}
            </q-tooltip>
          </q-btn>
      </q-td>
    </q-table>
  </div>
</template>
<script>
export default {
  name: 'Listable',
  props: ['columns', 'data', 'title'],
  data () {
    return {
    }
  },
  methods: {
    checkIfActions () {
      return this.columns.find((element) => element.name === 'actions')
    },
    execute (id, title) {
      const emit = {
        id,
        title
      }
      this.$emit('function', emit)
    }
  }
}
</script>

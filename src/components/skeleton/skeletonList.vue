<template>
    <div class="q-pa-md">
        <q-item v-for="i in 5" :key="i">
            <q-item-section avatar>
                <q-skeleton type="QAvatar" />
            </q-item-section>

            <q-item-section>
                <q-item-label>
                    <q-skeleton type="text" />
                </q-item-label>
                <q-item-label caption>
                    <q-skeleton type="text" width="65%" />
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-item>
            <q-item-section avatar>
                <q-skeleton type="QAvatar" />
            </q-item-section>

            <q-item-section>
                <q-item-label>
                    <q-skeleton type="text" />
                </q-item-label>
                <q-item-label caption>
                    <q-skeleton type="text" width="90%" />
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-item>
            <q-item-section avatar>
                <q-skeleton type="QAvatar" />
            </q-item-section>

            <q-item-section>
                <q-item-label>
                    <q-skeleton type="text" width="35%" />
                </q-item-label>
                <q-item-label caption>
                    <q-skeleton type="text" />
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-item>
            <q-item-section avatar>
                <q-skeleton type="QAvatar" />
            </q-item-section>

            <q-item-section>
                <q-item-label>
                    <q-skeleton type="text" width="70%" />
                </q-item-label>
                <q-item-label caption>
                    <q-skeleton type="text" />
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-item>
            <q-item-section avatar>
                <q-skeleton type="QAvatar" />
            </q-item-section>

            <q-item-section>
                <q-item-label>
                    <q-skeleton type="text" width="85%" />
                </q-item-label>
                <q-item-label caption>
                    <q-skeleton type="text" />
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-item>
            <q-item-section avatar>
                <q-skeleton type="QAvatar" />
            </q-item-section>

            <q-item-section>
                <q-item-label>
                    <q-skeleton type="text" width="40%" />
                </q-item-label>
                <q-item-label caption>
                    <q-skeleton type="text" />
                </q-item-label>
            </q-item-section>
        </q-item>
    </div>
</template>

<script>
export default {}
</script>

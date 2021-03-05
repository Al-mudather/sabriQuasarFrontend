<template>
    <div class="row">
        <div class="point" style="display: none">
            <img src="~assets/img/point.png" alt="" />
        </div>
        <div class="col-lg-2">
            <div class="users">
                <img src="~assets/img/man.png" alt="" />
                <h3 v-if="!lodash.isEmpty(question.user.firstName)">
                    {{question.user.firstName}} {{question.user.lastName}}
                </h3>
                <h3 v-else>{{question.user.email.split('@')[0]}}</h3>
            </div>
        </div>
        <div class="col-lg-10">
            <div class="pragh">
                <h3>
                    {{question.question}}
                </h3>
            </div>
            <div class="bottom">
                <div class="like" style="display: none">
                    <h4>
                        85
                        <svg
                            class="active"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14.122"
                            height="12.531"
                            viewBox="0 0 14.122 12.531"
                        >
                            <g
                                id="Group_722"
                                data-name="Group 722"
                                transform="translate(0 0)"
                            >
                                <path
                                    id="Path_345"
                                    data-name="Path 345"
                                    d="M244.4-311.631c-3.679,0-9.346-7.678-6.08-10.944a3.978,3.978,0,0,1,6,0s3.55-3.613,6.388.065S247.688-311.631,244.4-311.631Z"
                                    transform="translate(-237.34 324.162)"
                                    fill="#d8d8d9"
                                />
                                <path
                                    id="Path_346"
                                    data-name="Path 346"
                                    d="M245.551-312.678c-3.381,0-8.443-6.487-6.7-10.072a6.093,6.093,0,0,0-.533.474c-3.267,3.267,2.4,10.944,6.08,10.944,1.525,0,3.6-1.546,5.107-3.57C248.2-313.577,246.714-312.678,245.551-312.678Z"
                                    transform="translate(-237.34 323.863)"
                                    fill="#d0d0d1"
                                    opacity="0.08"
                                />
                            </g>
                        </svg>
                    </h4>
                </div>
                <div class="reply" style="cursor: pointer" @click="sendQuestionData">
                    <h4>{{question.questionreplySet.totalCount}} رد</h4>
                    <img class="person" src="~assets/img/hassbo.png" alt="" style="display: none" />
                    <img src="~assets/img/reply.png" alt="" />
                </div>
                <div class="more" style="display: none">
                    <h4>
                        {{$t('عرض المزيد')}}
                        <img src="~assets/img/moree.png" alt="" />
                    </h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  data () {
    return {
        lodash: this.$_
    }
  },
  props: ['question'],
  methods: {
    sendQuestionData () {
        this.$emit('questionData', this.question)
    }
  }
}
</script>

<style></style>

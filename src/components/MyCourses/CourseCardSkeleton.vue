<template>
    <div class="card skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton-pro">
            <div class="skeleton skeleton-bar"></div>
        </div>
        <div class="skeleton-body">
            <div class="skeleton skeleton-line skeleton-line-1"></div>
            <div class="skeleton skeleton-line skeleton-line-2"></div>
            <div class="skeleton skeleton-btn"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CourseCardSkeleton"
}
</script>

<style lang="scss" scoped>
.skeleton-card {
    border: 0;
    padding: 13px;
    border-radius: 23px;
    margin: 0 0 25px 0;
    background: #fff;
    box-shadow: 2px 6px 30px #e8e8e8;
    display: flex;
    flex-direction: column;
    height: calc(100% - 25px);
}

.skeleton {
    background: linear-gradient(90deg, #eee 0%, #f5f5f5 50%, #eee 100%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.4s ease-in-out infinite;
    border-radius: 8px;
}

.skeleton-img {
    width: 100%;
    aspect-ratio: 16 / 10;
    border-radius: 14px;
}

.skeleton-pro {
    margin-top: 6px;
    padding: 4px 0;
}

.skeleton-bar {
    height: 7px;
    border-radius: 50px;
}

.skeleton-body {
    padding: 8px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.skeleton-line {
    height: 16px;
    margin: 8px 0;
}

.skeleton-line-1 { width: 90%; }
.skeleton-line-2 { width: 65%; margin-bottom: 20px; }

.skeleton-btn {
    width: 100%;
    height: 44px;
    border-radius: 50px;
    margin-top: auto;
}

@keyframes skeleton-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>

from django.conf.urls import patterns, url, include

from djangular.views import IndexView

from rest_framework_nested import routers


from authentication.views import AccountViewSet, LoginJWTView, LoginView, LogoutView

from posts.views import AccountPostsViewSet, PostViewSet

router = routers.SimpleRouter()
router.register(r'posts', PostViewSet)
router.register(r'accounts', AccountViewSet)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)

accounts_router.register(r'posts', AccountPostsViewSet)

urlpatterns = patterns(
    '',

    url(r'^api/v1/', include(router.urls)),

    url(r'^api/v1/', include(accounts_router.urls)),

    url(r'^api/v1/auth/login/$',LoginJWTView.as_view(), name='jwt_login'),

    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),

    url('^.*$', IndexView.as_view(), name='index'),
)

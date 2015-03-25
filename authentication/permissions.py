from rest_framework import permissions


class IsAccountOwner(permissions.BasePermission):
    def has_objectpermission(self, request, view, account):
        if request.user:
            return account == request.user
        return False

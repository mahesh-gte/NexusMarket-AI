from fastapi import Header, HTTPException, status
from app.core.roles import ALL_ROLES

def get_current_role(x_role: str = Header("admin")):
    """
    Reads role from request header: X-ROLE (Defaults to 'admin' for dev)
    """
    role = x_role.lower()

    if role not in ALL_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing role"
        )

    return role


def require_role(allowed_roles: list):
    def role_checker(role: str = Header("admin", alias="X-ROLE")):
        role = role.lower()
        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied for this role"
            )
        return role

    return role_checker

# Member 6 — Cybersecurity, Blockchain & Evidence Intelligence

## 1. Role

Member 6 is responsible for cybersecurity, evidence protection,
integrity verification, blockchain-based evidence records,
authentication, authorization and security testing.

---

## 2. Authentication

The system uses:

- Password hashing with Argon2
- JWT-based authentication
- Token expiration
- Token validation

Passwords are never stored as plaintext.

---

## 3. Authorization

The system implements Role-Based Access Control (RBAC).

### Roles

- Admin
- Investigator
- Analyst
- Viewer

### Example permissions

| Role | Cases | Analytics | Evidence | User Management |
|------|-------|-----------|----------|-----------------|
| Admin | Yes | Yes | Yes | Yes |
| Investigator | Yes | Yes | Yes | No |
| Analyst | Yes | Yes | No | No |
| Viewer | Yes | No | No | No |

---

## 4. Evidence Classification

Evidence is classified into four levels:

- Public
- Internal
- Confidential
- Restricted

A user's clearance must be equal to or higher than
the classification of the requested evidence.

---

## 5. Evidence Access Control

Evidence access requires both:

1. Appropriate role permission
2. Sufficient clearance

Therefore, authentication alone does not provide access to
sensitive evidence.

---

## 6. Audit Logging

Security-sensitive actions are recorded with:

- Timestamp
- User ID
- Action
- Resource
- Result

Both successful and denied access attempts can be recorded.

Passwords, secrets and complete evidence contents are not
stored in audit logs.

---

## 7. Evidence Integrity

SHA-256 is used to calculate an evidence hash.

Workflow:

Evidence File
→ SHA-256
→ Evidence Hash
→ Store Hash

During verification:

Evidence File
→ SHA-256
→ Compare With Recorded Hash

Matching hashes indicate that the file contents have not
changed since the recorded hash was generated.

---

## 8. Blockchain Evidence Ledger

The actual sensitive evidence is kept outside the blockchain.

The ledger stores integrity-related information such as:

- Evidence ID
- Evidence SHA-256 hash
- Timestamp
- User ID
- Previous block hash
- Current block hash

Each block references the previous block, creating a
tamper-evident chain.

---

## 9. API Security

Frontend requests are intended to pass through the FastAPI
backend.

Security flow:

React
→ FastAPI
→ JWT Validation
→ Role Check
→ Permission Check
→ Resource Access

The frontend is not trusted to enforce authorization by itself.

---

## 10. Security Testing

The security implementation includes tests for:

- Password hashing
- Incorrect passwords
- JWT validation
- JWT tampering
- Invalid roles
- Permission restrictions
- Evidence classification
- Evidence access control
- Audit events
- SHA-256 integrity
- Blockchain tampering

---

## 11. Security Architecture

```text
                    USER
                      |
                      v
               Authentication
                      |
                      v
                    JWT
                      |
                      v
                   RBAC
                      |
                      v
              Permission Check
                      |
                      v
            Evidence Clearance
                      |
              +-------+-------+
              |               |
              v               v
          Evidence         Audit Log
              |
              v
           SHA-256
              |
              v
      Immutable Ledger
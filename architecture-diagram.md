# LinkBio Architecture Diagram

```mermaid
graph TB
    subgraph "User"
        A[Visitor Browser] -->|GET /username| B[Next.js App - Vercel]
        C[Admin Browser] -->|Sign In Google OAuth| B
    end

    subgraph "Vercel Deployment"
        B -->|Static Pages| D[Landing Page]
        B -->|Server Components| E[Public Profile Page]
        B -->|API Routes| F[API Layer]
        B -->|Client Components| G[Dashboard UI]
    end

    subgraph "AWS Cloud - eu-north-1"
        subgraph "DynamoDB"
            H[(linkbio table)]
            H1[PK: USER#email / SK: PROFILE]
            H2[PK: USERNAME#handle / SK: PROFILE]
            H3[PK: USER#email / SK: LINK#uuid]
            H4[PK: USER#email / SK: PRODUCT#uuid]
            H5[PK: CLICK#linkId / SK: TS#timestamp]
            H6[PK: LINKID#uuid / SK: META]
        end

        subgraph "S3"
            I[(linkbio-uploads bucket)]
            I1[avatars/ folder]
            I2[products/ folder]
        end
    end

    subgraph "External Services"
        J[Google OAuth]
    end

    F -->|AWS SDK| H
    F -->|AWS SDK| I
    B -->|NextAuth.js| J
    E -->|DynamoDB Query| H
    F -->|Upload files| I
```

## Data Flow

1. **Visitor** opens `https://linkbio.vercel.app/username`
2. **Next.js Server Component** queries DynamoDB:
   - `USERNAME#handle` → gets userId
   - `USER#userId` → gets profile + theme
   - `USER#userId` + `LINK#` prefix → gets links
   - `USER#userId` + `PRODUCT#` prefix → gets featured products
3. **Page renders** with theme applied, showing avatar, name, bio, featured products, and links
4. **Click on link** → `GET /api/track/linkId` → records click in DynamoDB + redirects to target URL
5. **Admin** signs in with Google → manages links/products in dashboard
6. **File uploads** → sent to `/api/upload` → stored in S3 → URL saved to DynamoDB

## AWS Database Used

**Amazon DynamoDB** - Single-table design with the following access patterns:
- Entity lookup by PK/SK composite key
- Username-to-userId reverse lookup
- All links/products for a user via query with `begins_with`
- Click events recorded with timestamp sort key for time-series analytics

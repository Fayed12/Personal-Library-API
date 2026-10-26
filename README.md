# 📚 Personal Library API

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20Ready-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-v9.10-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Security Helmet](https://img.shields.io/badge/Security-Helmet%20v8-blue?style=for-the-badge&logo=helmet&logoColor=white)](https://helmetjs.github.io/)
[![Version](https://img.shields.io/badge/Version-3.0.0-informational?style=for-the-badge)](#)

> **Personal Library API** is an enterprise-grade, RESTful backend service engineered with **Node.js**, **Express 5**, and **Mongoose 9**. It provides high-performance book collection lifecycle management, dynamic multi-field query parsing, real-time reading progress synchronization, and complex MongoDB aggregation pipelines for deep literary analytics.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Key Features](#-key-features)
- [Project Directory Structure](#-project-directory-structure)
- [Data Model & Schema Rules](#-data-model--schema-rules)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Installation & Execution](#installation--execution)
- [Database Seeding (`booksData.json`)](#-database-seeding-booksdatajson)
- [Comprehensive API Reference](#-comprehensive-api-reference)
  - [1. System & Health Endpoints](#1-system--health-endpoints)
  - [2. Book Queries & Advanced Filtering](#2-book-queries--advanced-filtering)
  - [3. Curated Reading Lists](#3-curated-reading-lists)
  - [4. Creation & Mutation Endpoints](#4-creation--mutation-endpoints)
  - [5. Reading Progress & Partial Updates](#5-reading-progress--partial-updates)
  - [6. Deletion Endpoints](#6-deletion-endpoints)
  - [7. Aggregation & Analytical Pipelines](#7-aggregation--analytical-pipelines)
- [Security & Validation Standards](#-security--validation-standards)
- [Author & Maintenance](#-author--maintenance)

---

## 🏛 Architectural Overview

The application is structured following Clean Code and modular Controller-Router architecture principles:
- **Express 5 Core**: Leverages modern promise handling and HTTP routing optimizations.
- **Robust DNS & Atlas Integration**: Custom multi-resolver DNS fallback (`8.8.8.8`, `1.1.1.1`) ensures zero lookup timeouts when connecting to MongoDB Atlas SRV records.
- **Strict Data Integrity**: Granular schema validations with intra-document validation constraints (e.g. `pagesRead` $\le$ `pages`), regex sanitization, and immutable field guards (`_id`, timestamps).
- **Interactive Welcome Portal**: An integrated HTML/CSS/JS frontend dashboard served directly from the root path (`/`) to test and visualize endpoints.

```
+-------------------------------------------------------------+
|                     Client / Consumers                      |
|          (Web Portal, Postman, Frontend Applications)       |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                   Security & Middleware                     |
|           • CORS Protection     • Helmet CSP Directives     |
|           • Strict JSON Parser  • Parameter Validation      |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                     Routing Layer (/api)                    |
|       /api/health       •       /api/books (Router)         |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                      Controller Layer                       |
|   • GET Query Engine       • Aggregation Pipelines          |
|   • Write Mutations        • Smart Progress Lifecycle       |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|               Data Layer (Mongoose Schema & Models)         |
|                     MongoDB Atlas Database                  |
+-------------------------------------------------------------+
```

---

## ✨ Key Features

- **⚡ Express 5 & Mongoose 9**: Modern Node.js runtime leveraging ES features and native async/await error propagation.
- **🔍 Advanced Query Engine**: Supports regular expression matching, case-insensitive search, exclusion filters (`notStatus`, `excludeStatuses`), boundary ranges (`minRating`, `maxRating`, `pagesOver`, `pagesUnder`, `fromYear`, `toYear`), field projections, sorting, and offset pagination.
- **📖 Intelligent Reading Progress Synchronization**: Custom business logic updates reading statuses automatically based on `pagesRead`:
  - `0 pages` $\rightarrow$ sets status to `"planned"` and `currentPage: 0`.
  - `1` to `pages - 1` $\rightarrow$ sets status to `"reading"` and `currentPage: pagesRead`.
  - `pages` (completed) $\rightarrow$ sets status to `"completed"`.
- **📊 MongoDB Aggregation Pipelines**: Real-time analytical statistics:
  - Library-wide total pages and average page counts.
  - Category-level distribution with book matrices.
  - Reading progress breakdown by status.
  - Average ratings grouped by genre.
  - Author catalog metrics with custom page count thresholds (`minBooks`).
- **🛡 Enterprise Security**: Hardened with Helmet CSP headers, configured CORS origins, and protected schema mutation guards preventing accidental modification of primary identifiers or timestamps.

---

## 📂 Project Directory Structure

```text
4-Personal-Library-API/
├── booksData.json                   # Curated 20-book dataset for seeding and initialization
├── package.json                     # Project manifest and dependencies
├── server.js                        # Application entry point & port listener
├── .env                             # Environment secrets (ignored by Git)
├── .example.env                     # Template environment variables
├── .gitignore                       # Git exclusion list
├── src/
│   ├── app.js                       # Express app configuration, security, & route mounting
│   ├── components/
│   │   └── welcome-page/            # Static interactive dashboard documentation
│   │       ├── favicon.svg          # Book SVG icon
│   │       ├── index.css            # Responsive UI styles
│   │       ├── index.html           # Documentation portal
│   │       └── index.js             # Client-side interactions
│   ├── controllers/
│   │   ├── aggregation/             # MongoDB aggregation pipeline handlers
│   │   │   ├── getAllStats.js       # Overall library statistics
│   │   │   ├── getAvgRating.js      # Global rating metrics
│   │   │   ├── getCountFilter.js    # Filtered document counts
│   │   │   ├── getRatingByCategory.js # Category-based rating analysis
│   │   │   ├── getStatsByCategory.js  # Category book distribution
│   │   │   └── getStatsByStatus.js    # Reading status breakdowns
│   │   ├── delete-method/           # Document deletion handlers
│   │   │   ├── deleteAll.js         # Truncate collection
│   │   │   ├── deleteBulk.js        # Multi-document filtered deletion
│   │   │   └── deleteOne.js         # Single book deletion by ID
│   │   ├── get-method/              # Read queries and curated listings
│   │   │   ├── getAllBooks.js       # Dynamic search, filter, sort & pagination
│   │   │   ├── getBookByCategory.js # Parametric category query
│   │   │   ├── getBookById.js       # Single book lookup by ID
│   │   │   ├── getInconsistentBooks.js # Data audit for invalid progress states
│   │   │   ├── getMustReadsBooks.js # High-rated completed books ($gte 4.5)
│   │   │   ├── getNextUpReading.js  # Prioritized backlog queue
│   │   │   ├── getNotHeavyBooks.js  # Concise reads (pages <= 300)
│   │   │   ├── getRecentBooks.js    # Recently added books
│   │   │   ├── getTopRated.js       # Top 5 highest-rated books
│   │   │   ├── getUnfinishedBooks.js# In-progress books ($expr: pagesRead < pages)
│   │   │   └── getWeekendReads.js   # Fast reads for weekends
│   │   ├── post-method/             # Document insertion handlers
│   │   │   ├── createNewBook.js     # Single book insertion
│   │   │   └── createNewBulkBooks.js# Bulk insertion with payload validation
│   │   └── update-method/           # Document update handlers
│   │       ├── updateAllBook.js     # Full document replacement (PUT)
│   │       ├── updateBook.js        # Partial document patch (PATCH)
│   │       ├── updateCategory.js    # Bulk category rename
│   │       ├── updateProgress.js    # Atomic progress & status synchronizer
│   │       ├── updateRating.js      # Rating patch
│   │       └── updateTags.js        # Set-based array tag modification
│   ├── routes/
│   │   └── booksRouters.js          # Master route registration & middleware chains
│   ├── schemas/
│   │   ├── bookSchema.js            # Mongoose schema definition with custom validators
│   │   └── models/
│   │       └── bookModel.js         # Compiled Mongoose Book model
│   └── services/
│       ├── checkAllowedFields.js    # Whitelist validator for incoming request fields
│       ├── connectToMongoose.js     # MongoDB connection with custom DNS resolver
│       └── readAllBooks.js          # Utility helper for local JSON datasets
```

---

## 📋 Data Model & Schema Rules

Each book document stored within the `books` collection adheres to the following Mongoose schema specifications:

| Field | Type | Required | Constraints & Validation | Description |
| :--- | :--- | :---: | :--- | :--- |
| `title` | `String` | **Yes** | Min 5 chars, trimmed, **unique** | Title of the publication. |
| `author` | `String` | **Yes** | Min 5 chars, trimmed | Full name of the author. |
| `category` | `String` | **Yes** | Min 5 chars, trimmed | Genre/domain (e.g., `software-engineering`, `business`). |
| `pages` | `Number` | **Yes** | Minimum: `0`, Default: `0` | Total volume page count. |
| `pagesRead` | `Number` | **Yes** | Min: `0`, Default: `0`, $\le$ `pages` | Current accumulated pages read. |
| `currentPage`| `Number` | **Yes** | Min: `0`, Default: `0`, $\le$ `pages` | Bookmark marker. |
| `rating` | `Decimal128`| **Yes** | Min: `0.0`, Max: `5.0`, Default: `0` | Reader rating (`0` denotes unrated). |
| `status` | `String` | **Yes** | Enum: `["planned", "reading", "completed"]` | Current reading status. Default: `"planned"`. |
| `publishedYear`| `Number` | **Yes** | Min: `1000`, Max: `Current Year` | Year of original publishing. |
| `tags` | `[String]` | **Yes** | Default: `[]` | Array of descriptive categorization tags. |
| `createdAt` | `Date` | Auto | Managed by Mongoose | Timestamp of document creation. |
| `updatedAt` | `Date` | Auto | Managed by Mongoose | Timestamp of last modification. |

> **Validation Note:** The schema is configured with `{ strict: "throw" }` and custom validators to reject unpermitted properties and prevent `pagesRead` from exceeding total `pages`.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Version **18.x** or higher recommended)
- [npm](https://www.npmjs.com/) (Version **9.x** or higher)
- A running instance of **MongoDB** (Local or [MongoDB Atlas Cluster](https://www.mongodb.com/atlas))

### Environment Configuration

Create a `.env` file in the root directory based on `.example.env`:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=mongodb+srv://<username>:<db_password>@cluster0.your-cluster.mongodb.net/personal_library?retryWrites=true&w=majority
PASSWORD=your_actual_database_password
```

> 💡 **Atlas Tip:** The application dynamically replaces `<db_password>` in `DATABASE_URL` with URL-encoded `PASSWORD` during the connection bootstrap in `src/services/connectToMongoose.js`.

### Installation & Execution

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Fayed12/Personal-Library-API.git
   cd Personal-Library-API
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server with hot-reload:**
   ```bash
   npm start
   ```

4. **Verify the server is running:**
   - Interactive Welcome Page: Open [http://localhost:4000/](http://localhost:4000/) in your browser.
   - Health Check: [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 📦 Database Seeding (`booksData.json`)

The repository includes a ready-to-use seed dataset located at [booksData.json](file:///d:/study/node.js/4-Personal-Library-API/booksData.json). It contains 20 curated books spanning software craftsmanship, computer science, business, history, and physics.

### Method 1: Direct Seeding via the Bulk API Endpoint (Recommended)

You can seed your database in one HTTP request using `curl`, Postman, or any API client. Wrap the array into a `"books"` key:

#### Linux / macOS:
```bash
curl -X POST http://localhost:4000/api/books/bulk \
  -H "Content-Type: application/json" \
  -d "{\"books\": $(cat booksData.json)}"
```

#### Windows PowerShell:
```powershell
$booksJson = Get-Content -Raw -Path .\booksData.json
$payload = @{ books = ($booksJson | ConvertFrom-Json) } | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "http://localhost:4000/api/books/bulk" -Method Post -ContentType "application/json" -Body $payload
```

### Method 2: Seeding via `mongoimport` CLI
If you prefer direct database insertion via MongoDB CLI tools:

```bash
mongoimport --uri "YOUR_MONGODB_URI" --collection books --file booksData.json --jsonArray
```

---

## 📖 Comprehensive API Reference

Base URL: `http://localhost:4000/api`

### 1. System & Health Endpoints

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | Serves the interactive static welcome dashboard | `200 OK` |
| `GET` | `/api/health` | Returns server health, uptime, and timestamp | `200 OK` |

**Sample Response (`GET /api/health`):**
```json
{
  "status": "ok",
  "developer": "mohamed fayed",
  "uptime": 124.58,
  "timestamp": "2026-10-26T17:35:00.000Z",
  "service": "Personal Library API",
  "message": "Server is online and healthy"
}
```

---

### 2. Book Queries & Advanced Filtering

#### `GET /api/books`
Retrieves books with deep filtering, regex search, value ranges, projections, multi-sort, and pagination.

**Supported Query Parameters:**

| Parameter | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `category` | `string` | `?category=software` | Case-insensitive regex match on category. |
| `status` | `string` | `?status=reading` | Filter by `planned`, `reading`, or `completed`. |
| `notStatus` | `string` | `?notStatus=completed` | Negation filter (matches books not having this status). |
| `author` | `string` | `?author=Robert` | Case-insensitive regex search by author. |
| `minRating` | `number` | `?minRating=4.0` | Minimum rating threshold ($0.0 - 5.0$). |
| `maxRating` | `number` | `?maxRating=4.5` | Maximum rating threshold ($0.0 - 5.0$). |
| `pagesOver` | `number` | `?pagesOver=300` | Books with page count strictly greater than value. |
| `pagesUnder`| `number` | `?pagesUnder=500` | Books with page count strictly lower than value. |
| `fromYear` | `number` | `?fromYear=2010` | Published on or after this year. |
| `toYear` | `number` | `?toYear=2024` | Published on or before this year. |
| `categories`| `csv` | `?categories=history,science` | Matches any category in the comma-separated list (`$in`). |
| `excludeStatuses`| `csv` | `?excludeStatuses=completed` | Excludes listed statuses (`$nin`). |
| `tags` | `csv` | `?tags=clean-code,architecture` | Matches books containing any of the provided tags. |
| `fields` | `csv` | `?fields=title,author,rating` | Comma-separated field projection (selects specific fields). |
| `sort` | `csv` | `?sort=-rating,pages` | Sort fields (prefix `-` denotes descending order). |
| `page` | `number` | `?page=2` | Pagination page number (default: `1`). |
| `limit` | `number` | `?limit=10` | Items per page (default: `5`, max: `20`). |

**Example Request:**
```http
GET /api/books?category=software-engineering&minRating=4.0&sort=-rating&limit=3 HTTP/1.1
Host: localhost:4000
```

---

### 3. Curated Reading Lists

Convenient single-purpose endpoints for popular discovery workflows:

| Method | Endpoint | Criteria / Logic |
| :--- | :--- | :--- |
| `GET` | `/api/books/:id` | Lookup single book by MongoDB ObjectId. Validates ID presence and existence. |
| `GET` | `/api/books/category/:category` | Fetch all books matching a specific category segment. |
| `GET` | `/api/books/top-rated` | Returns the **top 5 highest rated** books, sorted descending. |
| `GET` | `/api/books/recent` | Returns the **5 most recently added** books. |
| `GET` | `/api/books/must-reads` | Returns books with `rating >= 4.5` and `status == "completed"`. |
| `GET` | `/api/books/not-heavy` | Returns shorter books (`pages <= 300`). |
| `GET` | `/api/books/weekend-reads` | Returns concise, non-exhausting reading candidates. |
| `GET` | `/api/books/next-up` | Retrieves planned books with high priority or reading queue status. |
| `GET` | `/api/books/unfinished` | Uses `$expr` comparison finding books where `pagesRead < pages` and `pagesRead > 0`. |
| `GET` | `/api/books/inconsistent`| Diagnostic audit endpoint returning books where `status == "completed"` but `pagesRead < pages`. |

---

### 4. Creation & Mutation Endpoints

#### `POST /api/books`
Create a single book entry.

```json
// POST /api/books
{
  "title": "System Design Interview",
  "author": "Alex Xu",
  "category": "software-engineering",
  "pages": 300,
  "pagesRead": 50,
  "currentPage": 50,
  "rating": 4.5,
  "status": "reading",
  "publishedYear": 2020,
  "tags": ["system-design", "architecture"]
}
```

#### `POST /api/books/bulk`
Insert multiple books in a single transaction.

```json
// POST /api/books/bulk
{
  "books": [
    {
      "title": "Continuous Delivery",
      "author": "Jez Humble",
      "category": "software-engineering",
      "pages": 512,
      "publishedYear": 2010,
      "tags": ["devops", "ci-cd"]
    }
  ]
}
```

---

### 5. Reading Progress & Partial Updates

#### `PATCH /api/books/:id/progress`
Updates current reading progress and **automatically computes status & bookmarks**:
```json
// Payload
{
  "pagesRead": 250
}
```
- If `pagesRead === 0` $\rightarrow$ `status: "planned"`, `currentPage: 0`.
- If `0 < pagesRead < pages` $\rightarrow$ `status: "reading"`, `currentPage: pagesRead`.
- If `pagesRead === pages` $\rightarrow$ `status: "completed"`, `currentPage: pagesRead`.

#### `PATCH /api/books/:id/rating`
Update user rating for a specific book:
```json
{
  "rating": 4.8
}
```

#### `PATCH /api/books/:id/tags`
Append unique tags to a book's tag set without duplicates:
```http
PATCH /api/books/64b1f8e123456789abcdef01/tags?tags=cloud,distributed HTTP/1.1
```

#### `PATCH /api/books/bulk/category`
Rename an entire category across multiple records:
```json
{
  "from": "software-engineering",
  "to": "software-architecture"
}
```

#### `PATCH /api/books/:id`
Partial update with schema type and field guard validations.

#### `PUT /api/books/:id`
Replaces the full book document while preserving immutable identity.

---

### 6. Deletion Endpoints

| Method | Endpoint | Query / Rules | Description |
| :--- | :--- | :--- | :--- |
| `DELETE` | `/api/books/:id` | None | Removes a single book document by ID. |
| `DELETE` | `/api/books/bulk` | `?ids=id1,id2` or `?category=` or `?status=` or `?maxRating=` | Deletes multiple documents matching criteria (up to 20 IDs). |
| `DELETE` | `/api/books/all` | None | Drops all documents from the books collection. |

---

### 7. Aggregation & Analytical Pipelines

| Method | Endpoint | Analytical Insights |
| :--- | :--- | :--- |
| `GET` | `/api/books/stats` | Aggregates `totalBooks`, cumulative `totalPages`, and `averagePages`. |
| `GET` | `/api/books/stats/count` | Returns total document count matching active filter conditions. |
| `GET` | `/api/books/stats/average-rating` | Computes average rating across all rated books (`rating > 0`). |
| `GET` | `/api/books/stats/by-category` | Groups metrics by category: `count`, `totalPages`, and embedded book references. |
| `GET` | `/api/books/stats/by-status` | Groups metrics by reading status: `totalPages`, `totalPagesRead`, and book counts. |
| `GET` | `/api/books/stats/ratings-by-category` | Computes average rating and number of rated books grouped per category. |
| `GET` | `/api/books/stats/by-author?minBooks=2` | Analyzes prolific authors filtered by minimum publication volume. |

---

## 🔒 Security & Validation Standards

1. **Helmet Protection**: Incorporates Content Security Policy (CSP), frameguard, DNS prefetch control, and hide-powered-by headers.
2. **CORS Whitelist**: Configured to restrict or permit trusted origins (e.g., local development ports `5173`).
3. **Param Pre-condition Checks (`booksRouter.param`)**: The router verifies that IDs supplied in URI parameters are structurally valid and refer to active documents before forwarding to controllers.
4. **Strict Field Whitelisting (`validateFields`)**: Protects system properties (`_id`, `createdAt`, `updatedAt`) against unauthorized writes.
5. **Number & Type Enforcement**: Verifies that pages, progress numbers, and ratings adhere to strict boundary rules.

---

## 👨‍💻 Author & Maintenance

- **Developer**: Mohamed Fayed
- **Project**: Personal Library API
- **Repository**: [GitHub: Fayed12/Personal-Library-API](https://github.com/Fayed12/Personal-Library-API)
- **Issues & Contributions**: [Issue Tracker](https://github.com/Fayed12/Personal-Library-API/issues)

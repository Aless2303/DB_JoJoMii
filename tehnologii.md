# 📚 Documentație Completă - 3 Proiecte AI Hackathon

Acest document analizează în detaliu cele 3 proiecte de hackathon și oferă un **tutorial step-by-step** pentru a reproduce modul în care s-au implementat soluțiile AI.

---

## 📋 Cuprins

1. [Rezumat Tehnologii](#-rezumat-tehnologii)
2. [Proiect 1: Innovative4AI (PROXITY)](#-proiect-1-innovative4ai-proxity---nyc-business-simulator)
3. [Proiect 2: NEXXT_AI_PROJECT](#-proiect-2-nexxt_ai_project---customer-retention-intelligence)
4. [Proiect 3: SpaceFlow](#-proiect-3-spaceflow---room-booking-system)
5. [Workflow-uri Comune](#-workflow-uri-comune)
6. [Tutorial Step-by-Step](#-tutorial-step-by-step-pentru-implementare)
7. [Patterns și Best Practices](#-patterns-și-best-practices)

---

## 🔧 Rezumat Tehnologii

| Tehnologie | Innovative4AI | NEXXT_AI | SpaceFlow |
|------------|---------------|----------|-----------|
| **Vercel AI SDK** | ✅ DA (`ai` package) | ❌ NU | ❌ NU |
| **OpenAI SDK** | ✅ DA (`@ai-sdk/openai`) | ✅ DA (via LiteLLM) | ✅ DA (direct) |
| **OpenAI Agents SDK** | ❌ NU | ✅ DA (`openai-agents`) | ❌ NU |
| **LiteLLM** | ❌ NU | ✅ DA | ❌ NU |
| **AWS Bedrock** | ❌ NU | ✅ DA (Claude 4.5) | ❌ NU |
| **MCP (Model Context Protocol)** | ❌ NU | ✅ DA | ❌ NU |
| **RAG (Vector DB)** | ✅ DA (Qdrant) | ❌ NU | ❌ NU |
| **Structured Output (Zod)** | ✅ DA | ✅ DA (Pydantic) | ✅ DA (Pydantic) |
| **Multi-Agent System** | ✅ DA (9 agenți) | ✅ DA (13 agenți) | ❌ NU (1 agent) |

---

## 🏙️ Proiect 1: Innovative4AI (PROXITY) - NYC Business Simulator

### 📍 Descriere
Platformă AI de simulare business care modelează scenarii antreprenoriale în NYC. Folosește date US Census, Google Trends și **9 agenți AI specializați** pentru a genera prognoze lunare de performanță.

### 🛠️ Stack Tehnologic

**Frontend:**
- React 18 + Vite + TypeScript
- TanStack Query (server state)
- Mapbox GL JS (hărți interactive)
- Recharts (vizualizări)
- Tailwind CSS + shadcn/ui

**Backend:**
- FastAPI + Python
- SQLAlchemy + PostgreSQL
- US Census API
- Google Trends API (pytrends)

**Agents Orchestrator (IMPORTANT - folosește Vercel AI SDK):**
- **Next.js 14** (API routes)
- **Vercel AI SDK** (`ai` package v5.0.93)
- **@ai-sdk/openai** (v2.0.67)
- **Zod** pentru structured output
- **Qdrant** pentru RAG

### 🤖 Arhitectura Multi-Agent

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│  PHASE 0: RAG Retrieval (Qdrant)                    ~0.5s   │
│  PHASE 1: Market Context Agent (GPT-4-mini)         ~1s     │
│  PHASE 2: Events + Trends Agents (PARALLEL)         ~2s     │
│  PHASE 3: Supplier + Competition + Employee (PARALLEL) ~1.5s│
│  PHASE 4: Customer Simulation Agent                  ~2s     │
│  PHASE 5: Financial + Report Agents (PARALLEL)      ~3s     │
│  PHASE 6: RAG Storage                               ~0.2s   │
└─────────────────────────────────────────────────────────────┘
                    TOTAL: ~10 secunde/lună simulată
```

### 📄 Cum au implementat AI-ul

#### 1. Instalare dependențe (package.json)
```json
{
  "dependencies": {
    "@ai-sdk/openai": "^2.0.67",
    "@ai-sdk/anthropic": "^2.0.44",
    "@qdrant/js-client-rest": "^1.15.1",
    "ai": "^5.0.93",
    "zod": "^3.23.0",
    "next": "^14.2.0"
  }
}
```

#### 2. Pattern-ul de Agent cu Vercel AI SDK

**Fișier: `lib/simulation_agents/market-context-agent.ts`**

```typescript
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// 1. Definești schema cu Zod
export const MarketContextSchema = z.object({
  economic_climate: z.enum(['recession', 'stable', 'growth']),
  industry_saturation: z.number().min(0).max(100),
  market_demand_score: z.number(),
  seasonal_multiplier: z.number(),
  insights: z.string()
});

// 2. Funcția agentului
export async function analyzeMarketContext(
  businessType: string,
  location: { neighborhood: string },
  censusData: DetailedCensusData,
  survivalData: SurvivalData | null,
  currentMonth: number,
  currentYear: number
): Promise<z.infer<typeof MarketContextSchema>> {
  
  // Calcule matematice ÎNAINTE de LLM
  const industrySaturation = calculateIndustrySaturation(...);
  const economicClimate = calculateEconomicClimate(...);
  
  // 3. Apel LLM cu generateObject pentru structured output
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: MarketContextSchema,
    prompt: `
      Analyze market conditions for a ${businessType} in ${location.neighborhood}.
      
      Census Data:
      - Population: ${censusData.total_population}
      - Median Income: ${censusData.median_income}
      
      Pre-calculated metrics:
      - Industry Saturation: ${industrySaturation}%
      - Economic Climate: ${economicClimate}
      
      Provide market insights...
    `,
    temperature: 0.7,
  });

  return object;
}
```

#### 3. RAG Service cu Qdrant + Vercel AI SDK

**Fișier: `lib/services/rag-service.ts`**

```typescript
import { QdrantClient } from '@qdrant/js-client-rest';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const qdrant = new QdrantClient({ host: 'localhost', port: 6333 });

// Generare embedding cu Vercel AI SDK
export async function storeSimulationState(
  userId: string,
  businessId: string,
  month: number,
  stateSummary: SimulationStateSummary
): Promise<void> {
  
  const summaryText = createStateSummaryText(stateSummary);
  
  // Folosește `embed` din Vercel AI SDK
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: summaryText,
  });
  
  await qdrant.upsert('simulation_states', {
    points: [{
      id: `${userId}_${businessId}_month${month}`,
      vector: embedding,
      payload: {
        user_id: userId,
        business_id: businessId,
        month: month,
        revenue: stateSummary.revenue,
        profit: stateSummary.profit,
        // ... alte date
      }
    }]
  });
}

// Retrieve cu semantic search
export async function retrieveHistoricalContext(
  userId: string,
  businessId: string,
  currentMonth: number,
  limit: number = 3
): Promise<HistoricalContext> {
  
  const queryText = `Business state for month ${currentMonth}`;
  
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: queryText,
  });
  
  const results = await qdrant.search('simulation_states', {
    vector: embedding,
    limit: limit,
    filter: {
      must: [
        { key: 'user_id', match: { value: userId } },
        { key: 'business_id', match: { value: businessId } }
      ]
    }
  });
  
  return {
    recent_months: results.map(r => r.payload),
    similar_situations: [],
    past_recommendations: []
  };
}
```

#### 4. Orchestratorul - Execuție Paralelizată

**Fișier: `core/orchestrator.ts`**

```typescript
export async function runMonthlySimulation(input: SimulationInput): Promise<SimulationOutput> {
  
  // PHASE 0: RAG Retrieval
  const historicalContext = await retrieveHistoricalContext(
    input.userId, input.businessId, input.currentMonth, 3
  );
  
  // PHASE 1: Market Context (sequential)
  const marketContext = await analyzeMarketContext(...);
  
  // PHASE 2: External Analysis (PARALLEL)
  const [eventsData, trendsData] = await Promise.all([
    generateBusinessEvent(...),
    analyzeTrendsForBusiness(...),
  ]);
  
  // PHASE 3: Market Dynamics (PARALLEL)
  const [supplierData, competitionData, employeeData] = await Promise.all([
    analyzeSupplierDynamics(...),
    analyzeCompetition(...),
    Promise.resolve(calculateEmployeeMetrics(...)), // Pure math, no LLM
  ]);
  
  // PHASE 4: Customer Simulation
  const customerData = await simulateCustomerBehavior(...);
  
  // PHASE 5: Reporting (PARALLEL)
  const [financialData, report] = await Promise.all([
    Promise.resolve(analyzeFinancialPerformance(...)), // Pure math
    generateMonthlyReport(...), // LLM-powered
  ]);
  
  // PHASE 6: RAG Storage
  await storeSimulationState(...);
  
  return { marketContext, eventsData, trendsData, ... };
}
```

#### 5. API Route în Next.js

**Fișier: `app/api/simulate/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { runMonthlySimulation } from '@/core/orchestrator';

export async function POST(request: NextRequest) {
  const input = await request.json();
  
  const result = await runMonthlySimulation(input);
  
  return NextResponse.json(result);
}
```

---

## 🏦 Proiect 2: NEXXT_AI_PROJECT - Customer Retention Intelligence

### 📍 Descriere
Sistem AI pentru retenția clienților în banking. Folosește **13 agenți LLM specializați** cu OpenAI Agents SDK și Claude 4.5 via AWS Bedrock.

### 🛠️ Stack Tehnologic

**Frontend & UI:**
- **Streamlit** (Python web framework)
- st-annotated-text (highlighting)

**Backend & AI:**
- **OpenAI Agents SDK** (`openai-agents` v0.4.2)
- **LiteLLM** (model abstraction layer)
- **AWS Bedrock** (Claude 4.5 Sonnet)
- **MCP** (Model Context Protocol) pentru PostgreSQL
- **Pydantic** pentru validare

### 🤖 Arhitectura 13 Agenți

```
┌─────────────────────────────────────────────────────────┐
│              OPENAI AGENTS SDK FRAMEWORK                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │        ORCHESTRATOR AGENT (Coordinator)          │   │
│  └──────────────────┬──────────────────────────────┘   │
│                     │                                   │
│  ┌──────┬───────┬───┴───┬───────┬──────┬───────┐      │
│  │Profile│Content│ Risk │ Comms │Product│Sentiment│    │
│  │Agent │Persona│Assess │ Agent │Recom │Analysis │     │
│  └──────┴───────┴───────┴───────┴──────┴───────┘      │
│                                                         │
│  ┌──────┬───────┬───────┬───────┬──────┬───────┐      │
│  │Engage│Finance│Transac│Lifecy│Retent│Feedback│       │
│  │Optim │Health │Pattern│cleMgt│Strat │Process │       │
│  └──────┴───────┴───────┴───────┴──────┴───────┘      │
│                                                         │
│              ↓ LiteLLM Abstraction ↓                   │
│              AWS Bedrock (Claude 4.5)                   │
└─────────────────────────────────────────────────────────┘
```

### 📄 Cum au implementat AI-ul

#### 1. Instalare dependențe (requirements.txt)
```txt
openai-agents==0.4.2
litellm==1.79.0
mcp==1.20.0
boto3==1.40.64
streamlit==1.51.0
pydantic==2.12.3
```

#### 2. Configurare LiteLLM pentru AWS Bedrock

**Fișier: `src/config/settings.py`**

```python
import os
from dotenv import load_dotenv
from agents.extensions.models.litellm_model import LitellmModel

load_dotenv()

# Disable tracing
os.environ["AGENTS_TRACING_DISABLED"] = "true"
os.environ["LITELLM_TELEMETRY"] = "False"

# AWS Bedrock API Key
AWS_BEDROCK_API_KEY = os.getenv("AWS_BEARER_TOKEN_BEDROCK")

# Default model: Claude 4.5 Sonnet via Bedrock
DEFAULT_LITELLM_MODEL = os.getenv(
    "DEFAULT_LITELLM_MODEL",
    "global.anthropic.claude-sonnet-4-20250514-v1:0"
)

def build_default_litellm_model():
    """Return a LitellmModel configured for AWS Bedrock."""
    return LitellmModel(
        model=DEFAULT_LITELLM_MODEL, 
        api_key=AWS_BEDROCK_API_KEY
    )
```

#### 3. Pattern-ul de Agent cu OpenAI Agents SDK

**Fișier: `src/agents/product_recommendation_agent.py`**

```python
from agents import Agent, function_tool, Runner
from pydantic import BaseModel
from typing import List
from src.config.settings import build_default_litellm_model

# 1. Definești modele cu Pydantic
class UserProfile(BaseModel):
    marital_status: str | None = None
    annual_income: float | None = None
    age: int | None = None
    risk_tolerance: str | None = None
    financial_goals: list[str] = []

class ProductJustification(BaseModel):
    product_name: str
    relevance_score: float  # 0.0 to 1.0
    justification: str
    key_benefits: List[str]

# 2. Definești un tool (function_tool)
@function_tool
def get_user_profile(email: str) -> dict:
    """Retrieve user profile from database."""
    from src.utils.db import get_user_by_email
    return get_user_by_email(email)

@function_tool
def get_all_products() -> list:
    """Get all banking products from database."""
    from src.utils.db import get_all_products
    return get_all_products()

# 3. Creezi agentul cu OpenAI Agents SDK
product_justification_agent = Agent(
    name="Product Justification Agent",
    instructions="""
    You are a banking product expert. Analyze each product's relevance 
    for a specific user profile.
    
    Consider:
    - User's income and financial goals
    - Risk tolerance
    - Current life stage
    - Product benefits vs user needs
    
    Return a structured justification with relevance score (0-1).
    """,
    model=build_default_litellm_model(),
    tools=[get_user_profile, get_all_products],
)

# 4. Agent principal care folosește sub-agentul ca tool
product_recommendation_agent = Agent(
    name="Product Recommendation Orchestrator",
    instructions="""
    Orchestrate product ranking by calling the justification agent 
    for each product. Return ranked list.
    """,
    model=build_default_litellm_model(),
    tools=[product_justification_agent.as_tool(
        tool_name="justify_product",
        tool_description="Analyze product relevance for user"
    )],
)

# 5. Funcție pentru rulare
async def rank_products_for_profile(
    user_profile: UserProfile,
    products: list
) -> List[ProductJustification]:
    
    prompt = f"""
    User Profile: {user_profile.model_dump_json()}
    
    Products to analyze: {products}
    
    For each product, analyze relevance and return justification.
    """
    
    result = await Runner.run(product_recommendation_agent, prompt)
    return result.final_output
```

#### 4. MCP Server pentru PostgreSQL

**Fișier: `src/mcp-postgres/mcp_postgres/server.py`**

```python
from mcp import Server
from mcp.types import Tool
import psycopg

# MCP Server pentru acces read-only la PostgreSQL
server = Server()

@server.tool("sql_query")
async def sql_query(sql: str, params: dict = None) -> str:
    """Execute a read-only SQL query."""
    if not sql.strip().upper().startswith("SELECT"):
        raise ValueError("Only SELECT queries allowed")
    
    async with psycopg.connect(CONNECTION_STRING) as conn:
        async with conn.cursor() as cur:
            await cur.execute(sql, params)
            rows = await cur.fetchall()
            return json.dumps({"rows": rows})

@server.tool("sql_schema")
async def sql_schema(include_views: bool = True) -> str:
    """Get database schema information."""
    # ... implementare
```

#### 5. Pagină Streamlit

**Fișier: `pages/2_Product_Recommendations_Florea.py`**

```python
import streamlit as st
import asyncio
from agents import Runner
from src.agents.product_recommendation_agent import (
    rank_products_for_profile,
    UserProfile
)

st.title("🎯 Product Recommendations")

# Input utilizator
income = st.number_input("Annual Income (RON)", min_value=0)
risk = st.selectbox("Risk Tolerance", ["low", "medium", "high"])

if st.button("Get Recommendations"):
    profile = UserProfile(
        annual_income=income,
        risk_tolerance=risk
    )
    
    with st.spinner("AI analyzing products..."):
        # Run async în Streamlit
        results = asyncio.run(rank_products_for_profile(profile))
    
    for rec in results:
        st.markdown(f"### {rec.product_name}")
        st.progress(rec.relevance_score)
        st.write(rec.justification)
```

---

## 🏢 Proiect 3: SpaceFlow - Room Booking System

### 📍 Descriere
Platformă de management și rezervare spații cu **AI Event Planner** care sugerează camere bazat pe activități. Folosește OpenAI SDK direct (nu Vercel, nu Agents SDK).

### 🛠️ Stack Tehnologic

**Frontend:**
- React 18 + TypeScript + Vite
- Shadcn/UI + Radix UI + Tailwind CSS
- React Three Fiber + Three.js (3D/2D maps)
- TanStack Query + React Hook Form + Zod

**Backend:**
- FastAPI + Python
- SQLAlchemy + PostgreSQL (async cu asyncpg)
- **OpenAI SDK** (v1.12.0) - direct, fără wrapper
- JWT Authentication

### 🤖 Arhitectura AI (Un singur agent)

```
┌─────────────────────────────────────────────────────────┐
│                   EVENT SUGGESTION SERVICE               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │       AsyncOpenAI Client (gpt-4o-mini)          │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│         ┌───────────────┼───────────────┐              │
│         ▼               ▼               ▼              │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐          │
│   │  Parse   │   │  Suggest │   │ Fallback │          │
│   │  Prompt  │   │   Room   │   │  Logic   │          │
│   └──────────┘   └──────────┘   └──────────┘          │
│                                                         │
│  Input: Natural language prompt                         │
│  Output: Room suggestions with confidence scores        │
└─────────────────────────────────────────────────────────┘
```

### 📄 Cum au implementat AI-ul

#### 1. Instalare dependențe (requirements.txt)
```txt
openai==1.12.0
fastapi==0.115.0
sqlalchemy==2.0.36
asyncpg==0.30.0
pydantic==2.10.0
```

#### 2. Serviciu AI cu OpenAI SDK Direct

**Fișier: `app/crud/event_suggestion.py`**

```python
from openai import AsyncOpenAI
from pydantic import BaseModel, Field
from typing import List, Optional
import json

class RoomSuggestion(BaseModel):
    room_id: int
    room_name: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    reasoning: str

class EventSuggestionService:
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            timeout=120.0
        )
    
    async def _parse_prompt_to_activities(
        self,
        prompt: str,
        booking_date: Optional[date] = None
    ) -> dict:
        """Parse natural language into structured activities."""
        
        system_prompt = """You are an event planning assistant.
        Parse the user's request into structured activities.
        
        Return JSON:
        {
            "booking_date": "YYYY-MM-DD",
            "activities": [
                {
                    "name": "Activity name",
                    "start_time": "HH:MM",
                    "end_time": "HH:MM",
                    "participants_count": 1,
                    "required_amenities": ["Projector"],
                    "preferences": "any preferences"
                }
            ]
        }
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            temperature=0.6,
            max_tokens=900,
            response_format={"type": "json_object"},  # JSON mode
        )
        
        return json.loads(response.choices[0].message.content)
    
    async def _get_ai_room_suggestion(
        self,
        activity: ActivityRequest,
        available_rooms: List[Room]
    ) -> dict:
        """Get AI suggestion for best room."""
        
        rooms_context = self._prepare_rooms_context(available_rooms)
        
        system_prompt = """You are a room booking assistant.
        Select the best room based on:
        1. Capacity >= participants
        2. Required amenities present
        3. Activity type match
        
        Return JSON:
        {
            "suggested_room_id": <number>,
            "confidence_score": <0-1>,
            "reasoning": "<explanation>",
            "alternative_room_ids": [<numbers>]
        }
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Activity: {activity}\nRooms: {rooms_context}"},
            ],
            temperature=0.5,
            max_tokens=450,
            response_format={"type": "json_object"},
        )
        
        return json.loads(response.choices[0].message.content)
    
    def _fallback_room_selection(
        self,
        activity: ActivityRequest,
        available_rooms: List[Room]
    ) -> dict:
        """Fallback logic if AI fails."""
        # Logică bazată pe reguli simple
        suitable = [r for r in available_rooms 
                    if r.capacity >= activity.participants_count]
        
        if activity.required_amenities:
            suitable = [r for r in suitable 
                        if all(a in r.amenities for a in activity.required_amenities)]
        
        suitable.sort(key=lambda r: r.capacity)
        best = suitable[0] if suitable else available_rooms[0]
        
        return {
            "suggested_room_id": best.id,
            "confidence_score": 0.7,
            "reasoning": "Selected by capacity and amenities match",
            "alternative_room_ids": [r.id for r in suitable[1:4]]
        }
```

#### 3. API Route FastAPI

**Fișier: `app/api/routes/event_suggestions.py`**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.event_suggestion import (
    EventSuggestionRequest,
    EventSuggestionResponse
)
from app.crud.event_suggestion import event_suggestion_service

router = APIRouter()

@router.post("/suggest", response_model=EventSuggestionResponse)
async def get_event_suggestions(
    request: EventSuggestionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get AI-powered room suggestions."""
    
    suggestions = await event_suggestion_service.generate_suggestions(
        db=db,
        request=request,
        user_id=current_user.id
    )
    
    return suggestions
```

#### 4. Schema Pydantic

**Fișier: `app/schemas/event_suggestion.py`**

```python
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, time

class ActivityRequest(BaseModel):
    name: str
    start_time: time
    end_time: time
    participants_count: int = 1
    required_amenities: List[str] = []
    preferences: Optional[str] = None

class EventSuggestionRequest(BaseModel):
    prompt: Optional[str] = None  # Natural language
    booking_date: Optional[date] = None
    activities: Optional[List[ActivityRequest]] = None

class RoomSuggestion(BaseModel):
    room_id: int
    room_name: str
    capacity: int
    amenities: List[str]
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    reasoning: str

class ActivitySuggestion(BaseModel):
    activity_name: str
    start_time: time
    end_time: time
    suggested_room: RoomSuggestion
    alternative_rooms: List[RoomSuggestion] = []

class EventSuggestionResponse(BaseModel):
    suggestions: List[ActivitySuggestion]
    total_estimated_cost: float
```

---

## 🔄 Workflow-uri Comune

### Pattern 1: Structured Output cu Schema

Toate 3 proiectele folosesc schemas pentru output structurat:

| Proiect | Tehnologie | Exemplu |
|---------|------------|---------|
| Innovative4AI | Zod + `generateObject` | `MarketContextSchema.parse(...)` |
| NEXXT_AI | Pydantic | `ProductJustification.model_validate(...)` |
| SpaceFlow | Pydantic + JSON mode | `response_format={"type": "json_object"}` |

### Pattern 2: Prompt Engineering

Toate proiectele folosesc:
1. **System prompt** - definește rolul și comportamentul
2. **User prompt** - conține date specifice
3. **Context** - date din database/API externe

```
┌─────────────────────────────────────────┐
│           SYSTEM PROMPT                  │
│  - Rol: "You are a banking expert..."   │
│  - Reguli: "Return only JSON..."        │
│  - Format: Schema definition            │
└─────────────────────────────────────────┘
                    +
┌─────────────────────────────────────────┐
│           USER PROMPT                    │
│  - Date utilizator                      │
│  - Context din DB                       │
│  - Întrebare specifică                  │
└─────────────────────────────────────────┘
                    =
┌─────────────────────────────────────────┐
│        STRUCTURED OUTPUT                │
└─────────────────────────────────────────┘
```

### Pattern 3: Fallback Logic

SpaceFlow și Innovative4AI implementează fallback când AI eșuează:

```python
async def get_suggestion(...):
    try:
        # Try AI first
        return await self._get_ai_suggestion(...)
    except Exception as e:
        # Fallback to rule-based logic
        return self._fallback_selection(...)
```

### Pattern 4: Paralelizare

Innovative4AI folosește `Promise.all()` pentru agenți independenți:

```typescript
// TypeScript (Next.js)
const [events, trends] = await Promise.all([
    generateBusinessEvent(...),
    analyzeTrendsForBusiness(...)
]);
```

---

## 📝 Tutorial Step-by-Step pentru Implementare

### Opțiunea A: Vercel AI SDK (ca Innovative4AI)

**Când să folosești:** Când vrei structured output cu schema validation + streaming.

```bash
# 1. Init proiect Next.js
npx create-next-app@latest my-ai-app --typescript

# 2. Instalare dependențe
npm install ai @ai-sdk/openai zod

# 3. Setare variabile de mediu
echo "OPENAI_API_KEY=sk-..." > .env.local
```

**Cod minimal:**
```typescript
// lib/agents/my-agent.ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const MySchema = z.object({
  answer: z.string(),
  confidence: z.number().min(0).max(1)
});

export async function myAgent(question: string) {
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: MySchema,
    prompt: `Answer: ${question}`
  });
  return object;
}
```

### Opțiunea B: OpenAI Agents SDK (ca NEXXT_AI)

**Când să folosești:** Când ai nevoie de multi-agent orchestration cu tools.

```bash
# 1. Init proiect Python
mkdir my-agents && cd my-agents
python -m venv venv && source venv/bin/activate

# 2. Instalare
pip install openai-agents litellm pydantic streamlit

# 3. Variabile de mediu
echo "OPENAI_API_KEY=sk-..." > .env
```

**Cod minimal:**
```python
# agents/my_agent.py
from agents import Agent, function_tool, Runner
from pydantic import BaseModel

class MyOutput(BaseModel):
    answer: str
    confidence: float

@function_tool
def search_database(query: str) -> str:
    """Search the database."""
    return f"Results for: {query}"

my_agent = Agent(
    name="My Agent",
    instructions="Answer questions using the search tool.",
    tools=[search_database]
)

async def run_agent(question: str) -> MyOutput:
    result = await Runner.run(my_agent, question)
    return MyOutput.model_validate_json(result.final_output)
```

### Opțiunea C: OpenAI SDK Direct (ca SpaceFlow)

**Când să folosești:** Când vrei control complet fără abstractions.

```bash
# 1. Init proiect FastAPI
mkdir my-api && cd my-api
python -m venv venv && source venv/bin/activate

# 2. Instalare
pip install openai fastapi uvicorn pydantic

# 3. Variabile de mediu
echo "OPENAI_API_KEY=sk-..." > .env
```

**Cod minimal:**
```python
# services/ai_service.py
from openai import AsyncOpenAI
import json

client = AsyncOpenAI()

async def get_suggestion(prompt: str) -> dict:
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Return JSON only."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    return json.loads(response.choices[0].message.content)
```

---

## ⭐ Patterns și Best Practices

### 1. Separare Matematică vs LLM

```
✅ BUN: Calcule matematice ÎNAINTE de LLM
   - industrySaturation = calculateSaturation(data)
   - LLM primește valorile calculate

❌ RĂU: LLM face calcule
   - "Calculate the saturation rate..."
```

### 2. Schema First

```
✅ BUN: Definește schema înainte de cod
   const MySchema = z.object({...})
   
❌ RĂU: Parsezi JSON fără validare
   JSON.parse(response)
```

### 3. Timeout și Retry

```python
# SpaceFlow approach
client = AsyncOpenAI(timeout=120.0)

# Cu retry
from tenacity import retry, stop_after_attempt
@retry(stop=stop_after_attempt(3))
async def call_ai(...):
    ...
```

### 4. Logging și Debug

```python
print(f"[AI] Request: {prompt[:100]}...")
print(f"[AI] Response: {result}")
```

### 5. Cost Control

```
gpt-4o-mini: $0.15/$0.60 per 1M tokens (input/output)
gpt-4o:      $2.50/$10.00 per 1M tokens

→ Folosește gpt-4o-mini pentru majoritatea task-urilor
→ gpt-4o doar pentru rapoarte complexe
```

---

## 📊 Comparație Finală

| Aspect | Innovative4AI | NEXXT_AI | SpaceFlow |
|--------|---------------|----------|-----------|
| **Framework AI** | Vercel AI SDK | OpenAI Agents SDK | OpenAI Direct |
| **Complexitate** | High (9 agents) | High (13 agents) | Low (1 agent) |
| **RAG** | ✅ Qdrant | ❌ | ❌ |
| **Multi-Agent** | ✅ Orchestrator | ✅ Orchestrator | ❌ |
| **Streaming** | Posibil | Posibil | ❌ |
| **Provider Agnostic** | Partial | ✅ LiteLLM | ❌ OpenAI only |
| **Tools/Functions** | ❌ | ✅ function_tool | ❌ |
| **MCP** | ❌ | ✅ | ❌ |
| **Caz de utilizare** | Simulări complexe | Agenți modulari | API simple |

---

## 🚀 Quick Start Template

Pentru un proiect nou, recomand:

1. **Simple AI feature** → SpaceFlow approach (OpenAI direct)
2. **Multi-agent system** → NEXXT approach (Agents SDK)
3. **Complex orchestration + RAG** → Innovative4AI approach (Vercel AI SDK + Qdrant)

**Template recomandat pentru început:**

```
my-ai-project/
├── .env
├── package.json / requirements.txt
├── src/
│   ├── agents/
│   │   ├── schemas.ts / schemas.py
│   │   ├── agent-1.ts / agent_1.py
│   │   └── orchestrator.ts / orchestrator.py
│   ├── services/
│   │   └── rag-service.ts (opțional)
│   └── api/
│       └── routes/
└── docker-compose.yml
```

---

**Document generat pe baza analizei celor 3 proiecte de hackathon.**

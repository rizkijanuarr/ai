// ============================================
// Dataset Section Logic
// ============================================

// State
let currentFilter = 'all';
let currentPage = 1;
let currentSearchQuery = '';

// ============================================
// Toggle Dataset Section
// ============================================

/**
 * Toggle Dataset Section Visibility
 */
function toggleDatasetSection() {
    const section = document.getElementById('datasetSection');
    const isHidden = section.classList.contains('hidden');

    if (isHidden) {
        section.classList.remove('hidden');
        // Load dataset when opening
        loadDataset();
        // Smooth scroll to section
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else {
        section.classList.add('hidden');
        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ============================================
// Load Dataset
// ============================================

/**
 * Load Dataset List
 */
async function loadDataset() {
    const container = document.getElementById('datasetCardsContainer');

    try {
        // Show loading
        container.innerHTML = `
            <div class="text-center" style="padding: 2rem;">
                <span class="loading"></span>
                <p style="margin-top: 1rem; color: rgba(255, 255, 255, 0.7);">Memuat dataset...</p>
            </div>
        `;

        // Prepare params
        const params = {
            limit_data: 9,
            page: currentPage
        };

        // Add filter if not 'all'
        if (currentFilter !== 'all') {
            params.is_legal = currentFilter;
        }

        // Call API
        let response;
        if (currentSearchQuery) {
            response = await API.searchDataset(currentSearchQuery, params);
        } else {
            response = await API.getDatasetList(params);
        }

        if (response.success) {
            displayDatasetCards(response.data);
            displayPagination(response);
        } else {
            container.innerHTML = `
                <div class="text-center" style="padding: 2rem;">
                    <p style="color: rgba(255, 255, 255, 0.7);">❌ Gagal memuat dataset</p>
                </div>
            `;
        }

    } catch (error) {
        console.error('Error loading dataset:', error);
        container.innerHTML = `
            <div class="text-center" style="padding: 2rem;">
                <p style="color: rgba(255, 255, 255, 0.7);">❌ Gagal memuat dataset</p>
            </div>
        `;
    }
}

// ============================================
// Display Dataset Cards
// ============================================

/**
 * Display Dataset Cards
 * @param {array} datasets - Array of dataset objects
 */
function displayDatasetCards(datasets) {
    const container = document.getElementById('datasetCardsContainer');

    if (!datasets || datasets.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 2rem;">
                <p style="color: rgba(255, 255, 255, 0.7);">📭 Tidak ada data ditemukan</p>
            </div>
        `;
        return;
    }

    container.innerHTML = datasets.map(dataset => createDatasetCard(dataset)).join('');
}

/**
 * Create Dataset Card HTML
 * @param {object} dataset - Dataset object
 * @returns {string} HTML string
 */
function createDatasetCard(dataset) {
    const badgeType = dataset.is_legal === 1 ? 'success' : 'danger';
    const badgeLabel = dataset.is_legal === 1 ? 'Legal' : 'Ilegal';

    return `
        <div class="dataset-card fade-in">
            <div class="dataset-card-header">
                ${UIComponents.createBadge(badgeLabel, badgeType)}
                <span class="dataset-id">#${dataset.id}</span>
            </div>
            <div class="dataset-card-body">
                <h4 class="dataset-title">${Utils.truncateText(dataset.title, 60)}</h4>
                <p class="dataset-keyword">🔑 ${dataset.keyword}</p>
                <p class="dataset-description">${Utils.truncateText(dataset.description, 100)}</p>
                <a href="${dataset.link}" target="_blank" class="dataset-link">
                    🔗 ${Utils.truncateUrl(dataset.link, 35)}
                </a>
            </div>
            <div class="dataset-card-footer">
                <button class="btn btn-sm btn-outline" onclick="viewDatasetDetail(${dataset.id})">
                    👁️ Detail
                </button>
            </div>
        </div>
    `;
}

// ============================================
// Pagination
// ============================================

/**
 * Display Pagination
 * @param {object} response - API response with pagination data
 */
function displayPagination(response) {
    const container = document.getElementById('paginationContainer');

    // Extract pagination info
    const hasNext = response.has_next || false;
    const isFirst = response.is_first || false;
    const currentPageNum = response.current_page || currentPage;
    const totalData = response.total_data || 0;

    // Show/hide pagination
    if (totalData <= 9) {
        container.classList.add('hidden');
        return;
    }

    container.classList.remove('hidden');

    // Create pagination HTML
    container.innerHTML = `
        <div class="pagination">
            <button class="btn btn-outline"
                    onclick="changePage(${currentPageNum - 1})"
                    ${isFirst ? 'disabled' : ''}>
                ← Sebelumnya
            </button>
            <span class="page-info">Halaman ${currentPageNum}</span>
            <button class="btn btn-outline"
                    onclick="changePage(${currentPageNum + 1})"
                    ${!hasNext ? 'disabled' : ''}>
                Selanjutnya →
            </button>
        </div>
    `;
}

/**
 * Change Page
 * @param {number} page - Page number
 */
function changePage(page) {
    currentPage = page;
    loadDataset();

    // Scroll to top of dataset section
    document.getElementById('datasetSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// Filter Dataset
// ============================================

/**
 * Filter Dataset by Type
 * @param {string|number} filter - Filter value ('all', 0, 1)
 */
function filterDataset(filter) {
    currentFilter = filter;
    currentPage = 1; // Reset to first page

    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const activeTab = document.querySelector(`[data-filter="${filter === 1 ? 'legal' : filter === 0 ? 'illegal' : 'all'}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    loadDataset();
}

// ============================================
// Search Dataset
// ============================================

/**
 * Search Dataset Form Handler
 */
const searchForm = document.getElementById('searchDatasetForm');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const searchInput = document.getElementById('searchDatasetInput');
        currentSearchQuery = searchInput.value.trim();
        currentPage = 1; // Reset to first page

        loadDataset();
    });
}

// ============================================
// View Dataset Detail
// ============================================

/**
 * View Dataset Detail
 * @param {number} id - Dataset ID
 */
async function viewDatasetDetail(id) {
    try {
        const response = await API.getDatasetDetail(id);

        if (response.success) {
            showDatasetDetailModal(response.data);
        } else {
            alert('Gagal memuat detail dataset');
        }
    } catch (error) {
        console.error('Error loading dataset detail:', error);
        alert('Gagal memuat detail dataset');
    }
}

/**
 * Show Dataset Detail Modal
 * @param {object} dataset - Dataset object
 */
function showDatasetDetailModal(dataset) {
    const badgeType = dataset.is_legal === 1 ? 'success' : 'danger';
    const badgeLabel = dataset.is_legal === 1 ? 'Legal' : 'Ilegal';

    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>Detail Dataset #${dataset.id}</h3>
                    <button class="modal-close" onclick="closeModal()">✖️</button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        ${UIComponents.createBadge(badgeLabel, badgeType)}
                    </div>
                    <div class="detail-item">
                        <strong>Keyword:</strong>
                        <p>${dataset.keyword}</p>
                    </div>
                    <div class="detail-item">
                        <strong>Title:</strong>
                        <p>${dataset.title}</p>
                    </div>
                    <div class="detail-item">
                        <strong>Description:</strong>
                        <p>${dataset.description}</p>
                    </div>
                    <div class="detail-item">
                        <strong>Link:</strong>
                        <p><a href="${dataset.link}" target="_blank">${dataset.link}</a></p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal()">Tutup</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Close Modal
 */
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Make functions available globally
window.toggleDatasetSection = toggleDatasetSection;
window.filterDataset = filterDataset;
window.changePage = changePage;
window.viewDatasetDetail = viewDatasetDetail;
window.closeModal = closeModal;
